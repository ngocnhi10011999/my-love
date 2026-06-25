export const LOCALES = ['vi', 'en'];
export const DEFAULT_LOCALE = 'vi';

export const translations = {
  vi: {
    nav: {
      signedInAs: 'Đăng nhập với tư cách {role}',
      signOut: 'Đăng xuất',
    },
    gate: {
      eyebrow: 'Dành cho em',
      title: 'Góc Nhỏ Của Mình',
      prompt: 'Thì thầm mật khẩu nhé (là ngày sinh nhật em đó).',
      passwordPlaceholder: '••••••••',
      wrongPassword: 'Mật khẩu chưa đúng',
      unlocking: 'Đang mở…',
      openGallery: 'Mở thư viện',
    },
    hero: {
      eyebrow: 'Một góc nhỏ của hai đứa',
      title: 'Mỗi tấm ảnh là một nhịp tim.',
      // subtitle:
      // 'Một nơi yên tĩnh để lưu giữ những khoảnh khắc đáng nhớ — những buổi sáng dịu dàng, những nụ cười trộm, những điều mãi mãi bé nhỏ của đời thường.',
      subtitle:
        'Bốn năm bên nhau, tụi mình không còn những cuồng nhiệt thuở ban đầu, và những giận hờn, cãi vã cũng là điều khó tránh. Anh biết có những lúc cả hai đều cảm thấy mệt mỏi. Nhưng anh muốn em biết rằng, tình yêu anh dành cho em chưa bao giờ thay đổi. Chính vì người đó là em, nên dù có thế nào, anh vẫn luôn chọn ở lại và cùng em cố gắng. Dù có những lúc em muốn buông tay, thì ở đây, anh vẫn sẽ đứng chờ em. Vì anh biết chỉ có em là người duy nhất anh yêu, và là người duy nhất anh muốn cưới làm vợ. Con người ta ai cũng có thể thay đổi để hòa hợp với nhau hơn đúng không em? Chỉ cần tụi mình chân thành và tử tế với nhau, anh tin không gì là không thể vượt qua.',
    },
    admin: {
      uploading: 'Đang tải {done}/{total}…',
      addMemories: 'Thêm kỷ niệm',
      refresh: 'Làm mới',
      count: '{count} kỷ niệm',
    },
    gallery: {
      loadError: 'Không tải được ảnh: {error}',
      empty: 'Chưa có kỷ niệm nào.',
    },
    footer: {
      madeWith: 'làm bằng',
    },
    roles: {
      admin: 'quản trị',
      guest: 'khách',
    },
    language: {
      label: 'Ngôn ngữ',
      vi: 'Tiếng Việt',
      en: 'English',
    },
  },
  en: {
    nav: {
      signedInAs: 'Signed in as {role}',
      signOut: 'Sign out',
    },
    gate: {
      eyebrow: 'For you',
      title: 'Our Little Gallery',
      prompt: 'Whisper the secret word (it\'s her birthday).',
      passwordPlaceholder: '••••••••',
      wrongPassword: 'Incorrect password',
      unlocking: 'Unlocking…',
      openGallery: 'Open the gallery',
    },
    hero: {
      eyebrow: 'A little corner of us',
      title: 'Every picture, a heartbeat.',
      subtitle:
        'A quiet place to keep the moments worth remembering — soft mornings, stolen smiles, the everyday tiny forevers.',
    },
    admin: {
      uploading: 'Uploading {done}/{total}…',
      addMemories: 'Add memories',
      refresh: 'Refresh',
      count: '{count} {count, plural, one {memory} other {memories}}',
    },
    gallery: {
      loadError: 'Failed to load images: {error}',
      empty: 'No memories here yet.',
    },
    footer: {
      madeWith: 'made with',
    },
    roles: {
      admin: 'admin',
      guest: 'guest',
    },
    language: {
      label: 'Language',
      vi: 'Tiếng Việt',
      en: 'English',
    },
  },
};
