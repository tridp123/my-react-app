export const CONVERSATIONS = [
  // A1 - Beginner
  {
    id: 1,
    level: "A1",
    category: "Hằng ngày",
    title: "Gặp gỡ lần đầu",
    description: "Học cách chào hỏi và giới thiệu bản thân cơ bản.",
    dialogue: [
      { speaker: "Nam", text: "Hello! My name is Nam. Nice to meet you.", translation: "Xin chào! Tên tôi là Nam. Rất vui được gặp bạn." },
      { speaker: "Sarah", text: "Hi Nam! I'm Sarah. I'm from London. Nice to meet you too.", translation: "Chào Nam! Tôi là Sarah. Tôi đến từ London. Tôi cũng rất vui được gặp bạn." },
      { speaker: "Nam", text: "How are you today, Sarah?", translation: "Hôm nay bạn thế nào, Sarah?" },
      { speaker: "Sarah", text: "I'm doing great, thank you! And you?", translation: "Tôi đang rất tuyệt, cảm ơn bạn! Còn bạn?" },
      { speaker: "Nam", text: "I'm good. Welcome to Vietnam!", translation: "Tôi khỏe. Chào mừng bạn đến Việt Nam!" }
    ],
    vocabulary: [
      { word: "Meet", ipa: "/miːt/", meaning: "Gặp gỡ", example: "Nice to meet you." },
      { word: "Great", ipa: "/ɡreɪt/", meaning: "Tuyệt vời", example: "I'm doing great!" },
      { word: "Welcome", ipa: "/ˈwɛlkəm/", meaning: "Chào mừng", example: "Welcome to our home." }
    ],
    grammar: [
      {
        title: "Cấu trúc giới thiệu: My name is...",
        explanation: "Dùng để giới thiệu tên của mình một cách trang trọng. Bạn cũng có thể dùng 'I am...' hoặc 'I'm...'"
      },
      {
        title: "Cấu trúc: Nice to meet you",
        explanation: "Lời chào lịch sự khi lần đầu gặp ai đó. Người đối diện thường đáp lại bằng 'Nice to meet you too'."
      }
    ]
  },
  {
    id: 2,
    level: "A1",
    category: "Mua sắm/Dịch vụ",
    title: "Tại quán cà phê",
    description: "Cách gọi món và giao tiếp tại quán cà phê.",
    dialogue: [
      { speaker: "Waiter", text: "Hello! What would you like to order?", translation: "Xin chào! Bạn muốn gọi món gì?" },
      { speaker: "Customer", text: "I'd like a hot latte, please.", translation: "Tôi muốn một ly latte nóng, làm ơn." },
      { speaker: "Waiter", text: "Sure. Anything else?", translation: "Chắc chắn rồi. Còn gì nữa không ạ?" },
      { speaker: "Customer", text: "No, that's all. How much is it?", translation: "Không, vậy thôi. Hết bao nhiêu tiền nhỉ?" },
      { speaker: "Waiter", text: "It's 5 dollars. Cash or card?", translation: "5 đô la ạ. Tiền mặt hay thẻ?" },
      { speaker: "Customer", text: "Card, please.", translation: "Thẻ nhé." }
    ],
    vocabulary: [
      { word: "Order", ipa: "/ˈɔːrdər/", meaning: "Đặt hàng/Gọi món", example: "I would like to order a pizza." },
      { word: "Anything else", ipa: "/ˈɛniˌθɪŋ ɛls/", meaning: "Còn gì nữa không", example: "Is there anything else you need?" },
      { word: "Cash", ipa: "/kæʃ/", meaning: "Tiền mặt", example: "Do you prefer cash or card?" }
    ],
    grammar: [
      {
        title: "Cấu trúc: I'd like...",
        explanation: "Cách nói lịch sự thay cho 'I want...'. 'I'd' là viết tắt của 'I would'."
      },
      {
        title: "Hỏi giá tiền: How much is it?",
        explanation: "Dùng để hỏi giá của một món đồ. Nếu hỏi nhiều món, dùng 'How much are they?'"
      }
    ]
  },
  
  // A2 - Pre-intermediate
  {
    id: 3,
    level: "A2",
    category: "Hằng ngày",
    title: "Kế hoạch cuối tuần",
    description: "Bàn bạc về các hoạt động giải trí cuối tuần.",
    dialogue: [
      { speaker: "Alice", text: "What are you doing this weekend, Bob?", translation: "Bạn định làm gì cuối tuần này vậy Bob?" },
      { speaker: "Bob", text: "I'm going hiking with some friends. Do you want to join us?", translation: "Tôi định đi leo núi với mấy người bạn. Bạn có muốn tham gia cùng không?" },
      { speaker: "Alice", text: "I'd love to, but I have to finish a project for work.", translation: "Tôi rất muốn, nhưng tôi phải hoàn thành một dự án công việc." },
      { speaker: "Bob", text: "That's a pity. Maybe next time then?", translation: "Tiếc quá. Vậy để lần sau nhé?" },
      { speaker: "Alice", text: "Definitely! Have a great time!", translation: "Chắc chắn rồi! Chúc bạn đi chơi vui vẻ!" }
    ],
    vocabulary: [
      { word: "Hiking", ipa: "/ˈhaɪkɪŋ/", meaning: "Đi bộ đường dài/Leo núi", example: "I enjoy hiking in the mountains." },
      { word: "Pity", ipa: "/ˈpɪti/", meaning: "Đáng tiếc", example: "It's a pity that you can't come." },
      { word: "Definitely", ipa: "/ˈdefɪnətli/", meaning: "Chắc chắn rồi", example: "I will definitely be there." }
    ],
    grammar: [
      {
        title: "Thì hiện tại tiếp diễn chỉ tương lai",
        explanation: "Sử dụng 'I'm going...' hoặc 'What are you doing...' để nói về kế hoạch đã được sắp xếp trước trong tương lai."
      },
      {
        title: "Cấu trúc: I'd love to, but...",
        explanation: "Cách từ chối lời mời một cách lịch sự, sau đó thường đưa ra lý do."
      }
    ]
  },

  // B1 - Intermediate
  {
    id: 4,
    level: "B1",
    category: "Công việc",
    title: "Phỏng vấn xin việc",
    description: "Cấu trúc phỏng vấn và cách trả lời về kinh nghiệm bản thân.",
    dialogue: [
      { speaker: "Interviewer", text: "Tell me about your previous experience in this field.", translation: "Hãy cho tôi biết về kinh nghiệm trước đây của bạn trong lĩnh vực này." },
      { speaker: "Candidate", text: "I've worked as a web developer for three years. I'm proficient in React and Node.js.", translation: "Tôi đã làm lập trình viên web trong 3 năm. Tôi thành thạo React và Node.js." },
      { speaker: "Interviewer", text: "Why are you interested in working for our company?", translation: "Tại sao bạn lại quan tâm đến việc làm việc cho công ty chúng tôi?" },
      { speaker: "Candidate", text: "I've always admired your innovative projects. I believe my skills align with your goals.", translation: "Tôi luôn ngưỡng mộ các dự án đổi mới của quý công ty. Tôi tin rằng kỹ năng của mình phù hợp với mục tiêu của các bạn." },
      { speaker: "Interviewer", text: "That sounds promising. We'll get back to you soon.", translation: "Nghe có vẻ triển vọng đấy. Chúng tôi sẽ sớm phản hồi cho bạn." }
    ],
    vocabulary: [
      { word: "Proficient", ipa: "/prəˈfɪʃnt/", meaning: "Thành thạo", example: "She is proficient in three languages." },
      { word: "Admire", ipa: "/ədˈmaɪər/", meaning: "Ngưỡng mộ", example: "They admire him for his hard work." },
      { word: "Innovative", ipa: "/ˈɪnəveɪtɪv/", meaning: "Đổi mới/Sáng tạo", example: "We need more innovative ideas." }
    ],
    grammar: [
      {
        title: "Thì hiện tại hoàn thành (Present Perfect)",
        explanation: "Dùng 'I've worked...' để nói về kinh nghiệm nghề nghiệp kéo dài từ quá khứ đến hiện tại."
      },
      {
        title: "Cấu trúc: Align with...",
        explanation: "Có nghĩa là 'phù hợp với' hoặc 'ăn khớp với'. Thường dùng trong ngữ cảnh chuyên nghiệp."
      }
    ]
  }
];
