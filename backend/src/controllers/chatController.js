const db = require('../config/db');
const openai = require('../config/openai');
const { recordUserActivity } = require('../utils/activityLogger');

const listSessions = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, created_at, updated_at FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createSession = async (req, res) => {
  const { title, messages } = req.body;
  const sessionTitle = title || 'New Conversation';
  const sessionMessages = messages || [];
  try {
    await recordUserActivity(req.user.id, 'assistant_chat');

    const result = await db.query(
      'INSERT INTO chat_sessions (user_id, title, messages) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, sessionTitle, JSON.stringify(sessionMessages)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSession = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSession = async (req, res) => {
  const { title, messages } = req.body;
  try {
    await recordUserActivity(req.user.id, 'assistant_chat');

    const result = await db.query(
      `UPDATE chat_sessions 
       SET messages = $1, title = COALESCE($2, title), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [JSON.stringify(messages), title, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const streamChat = async (req, res) => {
  const { messages, mode, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  try {
    let streakResult = null;
    if (req.user) {
      streakResult = await recordUserActivity(req.user.id, 'assistant_chat');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const useFast = (mode === 'fast');
    
    // Dynamically detect Groq and set appropriate models/options
    const isGroq = (openai.baseURL && openai.baseURL.includes('groq')) || 
                   (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes('groq'));
    
    let modelName = model;
    if (!modelName) {
      if (isGroq) {
        modelName = useFast ? "llama-3.1-8b-instant" : "deepseek-r1-distill-llama-70b";
      } else {
        modelName = useFast ? "meta/llama-3.1-8b-instruct" : "meta/llama-3.3-70b-instruct";
      }
    }

    const completionOptions = {
      model: modelName,
      messages: messages,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: useFast ? 4096 : (isGroq ? 4096 : 16384),
      stream: true,
    };

    if (!useFast && !isGroq) {
      completionOptions.chat_template_kwargs = { "thinking": true, "reasoning_effort": "high" };
    }

    const completion = await openai.chat.completions.create(completionOptions);

    for await (const chunk of completion) {
      const delta = chunk.choices[0]?.delta;
      const content = delta?.content || '';
      const reasoning = delta?.reasoning || delta?.reasoning_content || '';

      if (content || reasoning) {
        res.write(`data: ${JSON.stringify({ content, reasoning })}\n\n`);
      }
    }

    if (streakResult) {
      res.write(`data: ${JSON.stringify({
        userStats: {
          streak_count: streakResult.streak_count,
          newXp: streakResult.new_xp,
          newLevel: streakResult.new_level
        }
      })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Error in chat stream:', err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

const enrichConcept = async (req, res) => {
  const { title, category, context, conceptTitle, topicTitle } = req.body;

  try {
    const prompt = `You are the Dev Empire AI Curriculum Architect.
Your task is to provide highly enriched, comprehensive, and detailed study notes on a specific node within a roadmap visualization.
 
Context:
- Domain/Topic: ${topicTitle}
- Concept: ${conceptTitle}
- Node Title: ${title}
- Node Category: ${category}
- Current short definition: ${context}

Generate an exhaustive, deep-dive explanation for this specific component. Include:
1. Architectural overview and why it works the way it does.
2. Advanced patterns, edge cases, or potential hidden complexities.
3. Production best practices.
4. A concrete real-world analogy.

Keep your response professional, engaging, formatted in clean markdown without title headings (use bold text or paragraphs for subheadings), and about 250-350 words of high-density learning material.`;

    const isGroq = (openai.baseURL && openai.baseURL.includes('groq')) || 
                   (process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.includes('groq'));
    const modelName = isGroq ? "llama-3.1-8b-instant" : "meta/llama-3.1-8b-instruct";

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are an expert curriculum designer. Provide rich, technical, and clear explanations in markdown." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    const enrichedContent = completion.choices[0]?.message?.content || "Enriched details currently unavailable.";
    res.json({ enrichedContent });
  } catch (err) {
    console.error('Error in concept enrichment:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession,
  streamChat,
  enrichConcept
};
