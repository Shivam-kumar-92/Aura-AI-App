// AURA AI Core Conversational & Multimodal Engine

export const PERSONALITIES = {
  prime: {
    id: 'prime',
    name: 'AURA Prime',
    tagline: 'Omniscient Multimodal Companion',
    color: '#00F0FF',
    glowClass: 'glow-aura-cyan',
    badge: 'AURA PRIME',
    voicePitch: 1.0,
    voiceRate: 1.05,
    greeting: "Hello! I am AURA Prime, your personal AI companion. How can I assist you and your friend today?"
  },
  nexus: {
    id: 'nexus',
    name: 'Cyber Nexus',
    tagline: 'Futuristic Tech & Code Specialist',
    color: '#A855F7',
    glowClass: 'glow-aura-violet',
    badge: 'NEXUS PRO',
    voicePitch: 0.9,
    voiceRate: 1.1,
    greeting: "Nexus online. Ready to architect solutions, debug complex code, or analyze technological frontiers."
  },
  muse: {
    id: 'muse',
    name: 'Zen Muse',
    tagline: 'Mindfulness, Clarity & Deep Thinking',
    color: '#10B981',
    glowClass: 'glow-aura-emerald',
    badge: 'ZEN CLARITY',
    voicePitch: 1.1,
    voiceRate: 0.95,
    greeting: "Welcome. Take a deep breath. Let us explore ideas with clarity, calm focus, and thoughtful perspective."
  },
  spark: {
    id: 'spark',
    name: 'Creative Spark',
    tagline: 'Art, Storytelling & Brainstorming',
    color: '#EC4899',
    glowClass: 'glow-aura-pink',
    badge: 'SPARK CREATIVE',
    voicePitch: 1.15,
    voiceRate: 1.08,
    greeting: "Hey there! Ready to craft exciting stories, invent new concepts, or brainstorm out-of-the-box ideas?"
  }
};

export async function generateAIResponse(userMessage, personality = 'prime', chatHistory = [], attachedImage = null) {
  // Simulate natural AI thinking latency
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

  const query = userMessage.toLowerCase().trim();
  const currentPersona = PERSONALITIES[personality] || PERSONALITIES.prime;

  // Multimodal Vision image analysis
  if (attachedImage) {
    if (query.includes('what') || query.includes('describe') || query.includes('analyze') || query.includes('see')) {
      return `I've analyzed your uploaded image through my vision scanner. 

🔍 **Visual Breakdown**:
- **Subject**: High-clarity visual scene with distinct focal elements and dynamic lighting.
- **Composition**: Balanced aesthetic with depth and sharp edge contrast.
- **Key Insight**: ${
  attachedImage.name?.toLowerCase().includes('racket') || query.includes('badminton') 
    ? 'This depicts high-performance sports equipment engineered for competitive agility and power.'
    : 'The image displays rich contextual detail, ready for creative exploration, code implementation, or design enhancement.'
}

Is there a specific detail you would like me to extract or optimize?`;
    }
  }

  // Conversational intelligence rules
  if (query.includes('who are you') || query.includes('what is aura')) {
    return `I am **AURA AI**—your next-generation personal mobile AI companion.

✨ **What I Can Do**:
- **Natural Voice Interaction**: Real-time speech recognition and synthesized voice conversations.
- **Multimodal Intelligence**: Image scanning, visual comprehension, and creative synthesis.
- **Dynamic Aura Orb**: Visualizes conversational states with audio-reactive luminous pulses.
- **Collaborative Sync**: Connect with your friend in a shared room to co-create and explore together!`;
  }

  if (query.includes('friend') || query.includes('share') || query.includes('room')) {
    return `You and your friend can use AURA AI together seamlessly! 
Go to the **Share / Sync** tab to generate a private 6-digit Room Code (or QR code). Once your friend enters the code on their mobile phone, your AI sessions, prompts, and insights will synchronize in real-time!`;
  }

  if (query.includes('code') || query.includes('python') || query.includes('react') || query.includes('javascript') || query.includes('bug')) {
    return `Here is a clean implementation based on your request:

\`\`\`javascript
// High-Performance Utility Function
export async function auraStreamProcessor(dataStream) {
  const buffer = [];
  for await (const chunk of dataStream) {
    const processed = await transformData(chunk);
    buffer.push(processed);
  }
  return buffer.join('');
}
\`\`\`

💡 **Architecture Note**: This handles asynchronous streams with zero memory bottlenecks and full error resilience. Let me know if you'd like to extend this for WebSocket channels or mobile state management!`;
  }

  if (query.includes('joke') || query.includes('funny')) {
    return `Why did the AI go to the gym? 

To improve its *neural weight training* and lower its *loss function*! 😄`;
  }

  if (query.includes('badminton') || query.includes('smash') || query.includes('racket')) {
    return `🏸 **Badminton Pro Insight**:
When delivering a high-speed smash, remember the kinetic chain: rotate your hips first, lead with the elbow, and unleash a sharp pronation snap right before shuttle impact. Rackets like the *Astrox 100ZZ* or *Nanoflare 1000Z* maximize this energy transfer into tournament-winning speed!`;
  }

  // Persona specific replies
  if (personality === 'nexus') {
    return `[NEXUS PRO]: Query processed. Analyzing systemic vector "${userMessage}".
Optimal strategy: Break down into modular subroutines, optimize latency parameters, and deploy via automated continuous pipelines. Ready for execution directives.`;
  }

  if (personality === 'muse') {
    return `[ZEN MUSE]: Reflecting upon "${userMessage}"...
Consider that true progress often comes not from rushing to solutions, but from observing the underlying pattern with calm clarity. How does this align with your ultimate goal?`;
  }

  if (personality === 'spark') {
    return `[CREATIVE SPARK]: That sparks an awesome idea! 🌟
What if we take "${userMessage}" and twist it into an unexpected creative concept? Imagine combining futuristic neon aesthetics with interactive storytelling where every decision unlocks a new visual chapter!`;
  }

  // Default AURA Prime rich intelligent response
  return `I understand you are exploring "${userMessage}". 

Here is my synthesis:
1. **Core Concept**: Focusing on clarity, performance, and intuitive execution.
2. **Key Recommendation**: Prioritize clean simplicity and test interactions directly on your device.
3. **Next Step**: Would you like me to generate code, write creative content, or deep dive into specific details?`;
}
