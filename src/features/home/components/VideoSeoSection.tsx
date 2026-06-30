// SEO-only transcript text, visually hidden (mirrors aum VideoSEO). Not shown to users.
const TRANSCRIPTS = [
  "My biggest challenge was getting in the mood. But once I received the Sildenafil, I definitely was in the mood within 20 minutes, 30 minutes. I mean, top performance!",
  "I'm very confident now. On my way home, my lady is waiting on me and I'll take a half of a tablet when I get home, I have no doubt that I'm gonna be ready to perform. You're gonna be in your top performing status. Trust me.",
  "What I like the most is that they're easy to order. The package is sent, very discreet, everything is very efficient. And when they say the package is gonna be there, it's gonna be there. You know, it's no hassles.",
  "My biggest concern was, were they FDA approved and was it safe? I had a couple of guys that used the company before and they didn't have any problems. I did my research and found out that it was FDA approved, and I went ahead, and I've been taking 'em for maybe two months now.",
  "I had to go ahead and try it. You can literally go all night with these, and I look forward to going home now. My sex life has changed, and wife is happier and things are going great. I think yours would be too.",
  "I would definitely encourage anybody else to get these. This company, the product is great. Go for it! I'm actually purchasing after this call 'cause I have gotten low. This has changed my life!",
  "The problem I had before I started using Sildenafil - my erection didn't last as long and I wanted to fully satisfy my spouse with longer lasting sex.",
  "One reason I chose Sildenafil was for the price. It was a lot less expensive than the other brands out there. Sildenafil fit the bill and fit my wallet too.",
  "You guys are fantastic nice people. Quick customer service, handle any questions that I have, getting the script from my doctor and getting the order processed and shipped.",
  "My wife is very happy with the performance and the satisfaction, and that's what counts, guys!",
  "I've already recommended Sildenafil to a couple of my buddies. We're in the same situation and I tell 'em it's fantastic! It works well and the price is right and the customer service is fantastic. By all means, order it today!",
  "I'm diabetic and I suffered a very bad case of erectile dysfunction.",
  "I tried other companies. They all seemed to fail. And then when I tried Sildenafil, it was the one for me! It really worked and me and my partner both enjoyed it.",
  "I would rate it a 10. It's by the best I've ever had and I'm gonna continue to use it 'cause I don't think there's nothing out there better than this.",
  "Before I tried it, I wondered about side effects, headaches, nausea, dizziness, you know, with I had none of that. It's just been the best product I had so far.",
  "I would recommend it to anybody who's having problems with performance right now. If you have erectile dysfunction try this!",
  "Before I got started UL products I had a challenge of being ready and I was insecure in myself in everything.",
  "The reason why I chose you was because that I was looking for a good company with a good price, and all the other companies I dealt with - it wasn't what I was looking for.",
  "Customer service was great, and I really like dealing with customer service because they work with you and they know what they're talking about.",
  "I really en enjoyed the experience with it and everything. And I just wanna thank y'all so much for it.",
  "I would recommend you 100%. If anybody out there is going through what I have experienced, give them a try and you will see that products really work.",
];

export const VideoSeoSection = () => (
  <div className="hidden">
    {TRANSCRIPTS.map((text, i) => (
      <p key={i}>{text}</p>
    ))}
  </div>
);
