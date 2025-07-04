// Language switching functionality
document.addEventListener("DOMContentLoaded", function () {
  // Default language is English
  let currentLang = localStorage.getItem("language") || "en";

  // Apply the saved language on page load
  applyLanguage(currentLang);

  // Desktop language toggle button event listener
  document
    .getElementById("language-toggle")
    .addEventListener("click", function () {
      // Toggle between languages
      currentLang = currentLang === "en" ? "vi" : "en";
      localStorage.setItem("language", currentLang);
      // Reload the page to ensure all translations are applied correctly
      window.location.reload();
    });

  // Mobile language toggle button event listener
  document
    .getElementById("language-toggle-mobile")
    .addEventListener("click", function () {
      // Toggle between languages
      currentLang = currentLang === "en" ? "vi" : "en";
      localStorage.setItem("language", currentLang);
      // Reload the page to ensure all translations are applied correctly
      window.location.reload();
    });

  // Function to apply language
  function applyLanguage(lang) {
    // Update the flag icons
    const desktopFlagIcon = document.getElementById("flag-icon-desktop");
    const mobileFlagIcon = document.getElementById("flag-icon-mobile");

    if (lang === "en") {
      // Show UK flag for English
      desktopFlagIcon.src = "https://flagcdn.com/w40/gb.png";
      desktopFlagIcon.alt = "English";
      mobileFlagIcon.src = "https://flagcdn.com/w40/gb.png";
      mobileFlagIcon.alt = "English";
    } else {
      // Show Vietnam flag for Vietnamese
      desktopFlagIcon.src = "https://flagcdn.com/w40/vn.png";
      desktopFlagIcon.alt = "Tiếng Việt";
      mobileFlagIcon.src = "https://flagcdn.com/w40/vn.png";
      mobileFlagIcon.alt = "Tiếng Việt";
    }

    // Update the html lang attribute
    document.documentElement.setAttribute("lang", lang);

    // Get all elements with data-lang attribute
    const elements = document.querySelectorAll("[data-lang]");

    // Update text content based on language
    elements.forEach((element) => {
      const key = element.getAttribute("data-lang");
      if (translations[key] && translations[key][lang]) {
        element.textContent = translations[key][lang];
      }
    });

    // Special handling for navigation items
    const navItems = document.querySelectorAll(".nav-link[data-lang]");
    navItems.forEach((navItem) => {
      const key = navItem.getAttribute("data-lang");
      if (translations[key] && translations[key][lang]) {
        navItem.textContent = translations[key][lang];
        // Force redraw
        navItem.style.display = "none";
        setTimeout(() => {
          navItem.style.display = "";
        }, 10);
      }
    });

    // Update placeholder attributes
    const placeholders = document.querySelectorAll("[data-lang-placeholder]");
    placeholders.forEach((element) => {
      const key = element.getAttribute("data-lang-placeholder");
      if (translations[key] && translations[key][lang]) {
        element.setAttribute("placeholder", translations[key][lang]);
      }
    });

    // Update data-text attributes for buttons
    const buttons = document.querySelectorAll("[data-text]");
    buttons.forEach((button) => {
      const text = button.getAttribute("data-text");
      const key = "btn_" + text.toLowerCase().replace(/\s+/g, "_");
      if (translations[key] && translations[key][lang]) {
        button.setAttribute("data-text", translations[key][lang]);
      }
    });

    // Force refresh of all spans inside buttons with data-lang
    const buttonSpans = document.querySelectorAll(".sim-btn span[data-lang]");
    buttonSpans.forEach((span) => {
      const key = span.getAttribute("data-lang");
      if (translations[key] && translations[key][lang]) {
        span.textContent = translations[key][lang];
      }
    });

    // Update weather widget
    if (document.querySelector(".weather-widget")) {
      const cityInput = document.getElementById("name");
      if (
        cityInput &&
        translations["weather_input_placeholder"] &&
        translations["weather_input_placeholder"][lang]
      ) {
        cityInput.placeholder = translations["weather_input_placeholder"][lang];
      }
    }

    // Log to console for debugging
    console.log("Language changed to: " + lang);
    console.log("All elements updated");
  }
});

// Translations object
const translations = {
  // Navigation
  nav_home: {
    en: "Home",
    vi: "Trang chủ",
  },
  nav_about: {
    en: "About",
    vi: "Giới thiệu",
  },
  nav_gallery: {
    en: "Gallery",
    vi: "Thư viện ảnh",
  },
  nav_projects: {
    en: "Projects",
    vi: "Dự án",
  },
  nav_weather: {
    en: "Weather",
    vi: "Thời tiết",
  },
  nav_news: {
    en: "News",
    vi: "Tin tức",
  },
  nav_contact: {
    en: "Contact",
    vi: "Liên hệ",
  },

  // Home section
  home_hello: {
    en: "Hello, I'm Duong",
    vi: "Xin chào, tôi là Dương",
  },
  home_intro: {
    en: '"This is where I share basic information about myself and my life."',
    vi: '"Đây là nơi tôi chia sẻ thông tin cơ bản về bản thân và cuộc sống của mình."',
  },
  home_aka: {
    en: "Nguyen Hai Duong, aka ",
    vi: "Nguyễn Hải Dương, hay còn gọi là ",
  },

  // About section
  about_title: {
    en: "About Me",
    vi: "Về tôi",
  },
  about_p1: {
    en: "Hello everyone, I'm Duong, 21 years old. I'm a four-year student majoring in Information Technology.",
    vi: "Xin chào mọi người, tôi là Dương, 21 tuổi. Tôi là sinh viên năm thứ tư chuyên ngành Công nghệ thông tin.",
  },
  about_p2: {
    en: "This website is where I share my personal projects, technology articles, and my interests. Feel free to explore and connect with me! Have a great day!",
    vi: "Trang web này là nơi tôi chia sẻ các dự án cá nhân, bài viết công nghệ và sở thích của mình. Hãy thoải mái khám phá và kết nối với tôi! Chúc bạn một ngày tốt lành!",
  },
  download_cv_eng: {
    en: "Download CV (ENG)",
    vi: "Tải CV (Tiếng Anh)",
  },
  download_cv_vie: {
    en: "Download CV (VIE)",
    vi: "Tải CV (Tiếng Việt)",
  },

  // Skills section
  skills_title: {
    en: "My Skills",
    vi: "Kỹ năng của tôi",
  },
  skill_web: {
    en: "Web Development",
    vi: "Phát triển Web",
  },
  skill_ui: {
    en: "UI/UX Design",
    vi: "Thiết kế UI/UX",
  },
  skill_mobile: {
    en: "Mobile Development",
    vi: "Phát triển ứng dụng di động",
  },
  skill_db: {
    en: "Database Management",
    vi: "Quản lý cơ sở dữ liệu",
  },
  skill_eng: {
    en: "English",
    vi: "Tiếng Anh",
  },

  // Education section
  edu_title: {
    en: "Education & Experience",
    vi: "Học vấn & Kinh nghiệm",
  },
  edu_period_1: {
    en: "2022 - Present",
    vi: "2022 - Hiện tại",
  },
  edu_school_1: {
    en: "Electric Power University",
    vi: "Đại học Điện lực",
  },
  edu_period_2: {
    en: "2019 - 2022",
    vi: "2019 - 2022",
  },
  edu_school_2: {
    en: "Lao Cai City High School No. 1",
    vi: "Trường THPT Số 1 TP. Lào Cai",
  },
  edu_period_3: {
    en: "2015 - 2019",
    vi: "2015 - 2019",
  },
  edu_school_3: {
    en: "Bac Cuong Secondary School",
    vi: "Trường THCS Bắc Cường",
  },
  edu_period_4: {
    en: "2010 - 2015",
    vi: "2010 - 2015",
  },
  edu_school_4: {
    en: "Le Van Tam Primary School",
    vi: "Trường Tiểu học Lê Văn Tám",
  },

  // Projects section
  projects_title: {
    en: "My Projects",
    vi: "Dự án của tôi",
  },
  projects_subtitle: {
    en: "Here are some of my recent projects and works",
    vi: "Dưới đây là một số dự án và công việc gần đây của tôi",
  },
  view_all_projects: {
    en: "View All Projects",
    vi: "Xem tất cả dự án",
  },
  project1_title: {
    en: "Smovie",
    vi: "Smovie",
  },
  project1_desc: {
    en: "A comprehensive online movie streaming platform with user reviews, and advanced search functionality.",
    vi: "Nền tảng xem phim trực tuyến toàn diện với đánh giá của người dùng và chức năng tìm kiếm nâng cao.",
  },
  project2_title: {
    en: "Sbook",
    vi: "Sbook",
  },
  project2_desc: {
    en: "An innovative e-book reader application with customizable reading experience, bookmarking features, and a vast library of digital content.",
    vi: "Ứng dụng đọc sách điện tử sáng tạo với trải nghiệm đọc tùy chỉnh, tính năng đánh dấu và thư viện nội dung số phong phú.",
  },
  project3_title: {
    en: "Text Summarization",
    vi: "Tóm tắt văn bản",
  },
  project3_desc: {
    en: "An advanced web-based text summarization tool leveraging natural language processing, machine learning algorithms, and interactive visualization for comprehensive content analysis.",
    vi: "Công cụ tóm tắt văn bản trên web nâng cao sử dụng xử lý ngôn ngữ tự nhiên, thuật toán học máy và trực quan hóa tương tác để phân tích nội dung toàn diện.",
  },

  // Gallery section
  gallery_title: {
    en: "Gallery",
    vi: "Thư viện ảnh",
  },
  gallery_subtitle: {
    en: "Each photo tells a story, a chapter in the meaningful journey of my personal experiences.",
    vi: "Mỗi bức ảnh kể một câu chuyện, một chương trong hành trình ý nghĩa của những trải nghiệm cá nhân của tôi.",
  },
  gallery_childhood: {
    en: "Childhood",
    vi: "Tuổi thơ",
  },
  gallery_family: {
    en: "Family",
    vi: "Gia đình",
  },
  gallery_friends: {
    en: "Friends",
    vi: "Bạn bè",
  },
  gallery_all: {
    en: "All",
    vi: "Tất cả",
  },

  // Weather section
  weather_title: {
    en: "Weather Information",
    vi: "Thông tin thời tiết",
  },
  weather_subtitle: {
    en: "Current weather information for cities and countries around the world.",
    vi: "Thông tin thời tiết hiện tại cho các thành phố và quốc gia trên thế giới.",
  },
  weather_input_placeholder: {
    en: "Enter city name...",
    vi: "Nhập tên thành phố...",
  },
  weather_clouds: {
    en: "Clouds",
    vi: "Mây",
  },
  weather_humidity: {
    en: "Humidity",
    vi: "Độ ẩm",
  },
  weather_pressure: {
    en: "Pressure",
    vi: "Áp suất",
  },

  // News section
  news_title: {
    en: "News",
    vi: "Tin tức",
  },
  news_subtitle: {
    en: "Some recent news",
    vi: "Một số tin tức gần đây",
  },
  news_category_1: {
    en: "Entertainment",
    vi: "Giải trí",
  },
  news_title_1: {
    en: 'Pam dear - "entertainment seedling"',
    vi: 'Pam yêu ơi - "mầm non giải trí"',
  },
  news_desc_1: {
    en: "Pamela, also known as Pam dear by many netizens, real name Hai Duong, born in 2022 and is the first daughter of actress. She has become a social media sensation with her adorable videos.",
    vi: "Pamela, còn được nhiều cư dân mạng gọi là Pam yêu ơi, tên thật là Hải Dương, sinh năm 2022 và là con gái đầu lòng của nữ diễn viên. Cô bé đã trở thành hiện tượng mạng xã hội với những video đáng yêu của mình.",
  },
  news_category_2: {
    en: "Lifestyle",
    vi: "Phong cách sống",
  },
  news_title_2: {
    en: "The many facets of love",
    vi: "Nhiều khía cạnh của tình yêu",
  },
  news_desc_2: {
    en: "Love is one of the most used nouns and is said to be one of the oldest in human history. This article explores the different dimensions of love and how it shapes our lives and relationships.",
    vi: "Tình yêu là một trong những danh từ được sử dụng nhiều nhất và được cho là một trong những từ cổ xưa nhất trong lịch sử nhân loại. Bài viết này khám phá các khía cạnh khác nhau của tình yêu và cách nó định hình cuộc sống và các mối quan hệ của chúng ta.",
  },
  news_category_3: {
    en: "Music",
    vi: "Âm nhạc",
  },
  news_title_3: {
    en: "BlackPink show in Hanoi",
    vi: "Show diễn BlackPink tại Hà Nội",
  },
  news_desc_3: {
    en: "After the first Born Pink night in Hanoi, the audience felt satisfied and excited. The show encountered heavy rain at the beginning but continued with spectacular performances and effects.",
    vi: "Sau đêm Born Pink đầu tiên tại Hà Nội, khán giả cảm thấy hài lòng và phấn khích. Show diễn gặp phải mưa lớn vào đầu nhưng vẫn tiếp tục với những màn trình diễn và hiệu ứng đặc sắc.",
  },
  view_more_news: {
    en: "View More News",
    vi: "Xem thêm tin tức",
  },

  // Contact section
  contact_title: {
    en: "Contact Me",
    vi: "Liên hệ với tôi",
  },
  contact_subtitle: {
    en: "Feel free to reach out through any of these channels or send me a message directly. I'd love to hear from you!",
    vi: "Hãy liên hệ với tôi qua bất kỳ kênh nào hoặc gửi tin nhắn trực tiếp. Tôi rất muốn nghe từ bạn!",
  },
  contact_info_title: {
    en: "Contact Information",
    vi: "Thông tin liên hệ",
  },
  contact_phone: {
    en: "Phone",
    vi: "Điện thoại",
  },
  contact_anon_title: {
    en: "Anonymous Messages",
    vi: "Tin nhắn ẩn danh",
  },
  contact_message_placeholder: {
    en: "Enter your message here...",
    vi: "Nhập tin nhắn của bạn tại đây...",
  },
  contact_send_button: {
    en: "Send Message",
    vi: "Gửi tin nhắn",
  },
};
