const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const galleryDir = path.join(publicDir, 'media', 'gallery');
const targetFile = path.join(__dirname, 'src', 'components', 'GallerySection', 'galleryItems.json');

// Ensure public/media/gallery exists
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Map of legacy paths / specific filenames to titles and years
const knownMetadata = {
  // Childhood
  '/media/gallery/childhood/child-1.jpg': { title: 'Sweet Memory', year: 'Early years' },
  '/media/gallery/childhood/child-2.png': { title: 'Childhood Memory 2', year: 'Early years' },
  '/media/gallery/childhood/child-3.jpg': { title: 'Childhood Memory 3', year: 'Early years' },

  // Family
  '/media/gallery/family/family-1.jpg': { title: 'Family Moment 1', year: 'Memorable days' },
  '/media/gallery/family/family-1.png': { title: 'Family Gathering', year: 'Memorable days' },
  '/media/gallery/family/family-2.jpg': { title: 'Warmth of Home', year: 'Memorable days' },
  '/media/gallery/family/family-3.jpg': { title: 'Family Reunion', year: 'Memorable days' },

  // Friends
  '/media/gallery/friends/friends-1.jpg': { title: 'Friendship Story', year: 'School days' },
  '/media/gallery/friends/friends-2.png': { title: 'Joyful Moments', year: 'School days' },
  '/media/gallery/friends/friends-3.png': { title: 'Friends Hangout 3', year: 'School days' },

  // Dbill
  '/media/gallery/dbill/dbill-1.jpg': { title: 'Personal Style', year: 'Personal log' },
  '/media/gallery/dbill/dbill-2.png': { title: 'Casual Look', year: 'Personal log' },
  '/media/gallery/dbill/dbill-3.png': { title: 'Profile Shoot', year: 'Personal log' },
  '/media/gallery/dbill/portrait-1.jpg': { title: 'Candid Shot', year: 'Personal log' }
};

const defaultYears = {
  childhood: 'Early years',
  family: 'Memorable days',
  friends: 'School days',
  dbill: 'Personal log',
  others: 'Gallery'
};

const defaultTitles = {
  childhood: 'Childhood Memory',
  family: 'Family Moment',
  friends: 'Friends Hangout',
  dbill: 'Dbill Snapshot',
  others: 'Visual Diary'
};

function formatTitle(filename, category) {
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  const lowerName = nameWithoutExt.toLowerCase();
  
  // Clean up prefix if the title is generated
  if (/^\d+$/.test(nameWithoutExt) || 
      lowerName.startsWith('img_') || 
      lowerName.startsWith('dsc_') || 
      lowerName.startsWith('fam') || 
      lowerName.startsWith('fen') || 
      lowerName.startsWith('child') || 
      lowerName.startsWith('moment') || 
      lowerName.startsWith('portrait') ||
      lowerName.startsWith('dbill')) {
    const match = nameWithoutExt.match(/\d+/);
    const num = match ? ` ${match[0]}` : '';
    const catTitle = defaultTitles[category] || (category.charAt(0).toUpperCase() + category.slice(1));
    return `${catTitle}${num}`;
  }
  
  // Format camelCase/kebab-case/snake_case to Spaced words
  let title = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
  
  return title
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// 1. Auto-organize files directly in public/media/gallery into subdirectories
const filesInGallery = fs.readdirSync(galleryDir);
filesInGallery.forEach(file => {
  const filePath = path.join(galleryDir, file);
  const stat = fs.statSync(filePath);
  
  if (stat.isFile() && /\.(png|jpe?g|svg|gif|webp|bmp|jpg|png|jpeg|JPG|PNG)$/i.test(file)) {
    let destDirName = 'others';
    const lowerFile = file.toLowerCase();
    
    if (lowerFile.startsWith('child')) {
      destDirName = 'childhood';
    } else if (lowerFile.startsWith('dbill') || lowerFile.startsWith('portrait')) {
      destDirName = 'dbill';
    } else if (lowerFile.startsWith('family')) {
      destDirName = 'family';
    } else if (lowerFile.startsWith('friends')) {
      destDirName = 'friends';
    } else if (lowerFile.startsWith('moment')) {
      destDirName = 'others';
    }
    
    const destDir = path.join(galleryDir, destDirName);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    const destPath = path.join(destDir, file);
    fs.renameSync(filePath, destPath);
    console.log(`Auto-organized: Moved ${file} -> media/gallery/${destDirName}/${file}`);
  }
});

const galleryItems = [];

// 2. Scan all subdirectories in public/media/gallery
if (fs.existsSync(galleryDir)) {
  const subdirs = fs.readdirSync(galleryDir).filter(file => {
    return fs.statSync(path.join(galleryDir, file)).isDirectory();
  });
  
  subdirs.forEach(cat => {
    const catDir = path.join(galleryDir, cat);
    const files = fs.readdirSync(catDir);
    
    files.forEach(file => {
      // Check if it's an image
      if (/\.(png|jpe?g|svg|gif|webp|bmp|jpg|png|jpeg|JPG|PNG)$/i.test(file)) {
        const imgPath = `/media/gallery/${cat}/${file}`;
        
        let title = '';
        let year = '';

        if (knownMetadata[imgPath]) {
          title = knownMetadata[imgPath].title;
          year = knownMetadata[imgPath].year;
        } else {
          title = formatTitle(file, cat);
          year = defaultYears[cat] || 'Gallery';
        }

        // Match category code capitalization
        let capitalizedCategory = cat;
        if (cat === 'dbill') {
          capitalizedCategory = 'Dbill';
        } else if (cat === 'childhood') {
          capitalizedCategory = 'Childhood';
        } else {
          capitalizedCategory = cat.charAt(0).toUpperCase() + cat.slice(1);
        }

        galleryItems.push({
          image: imgPath,
          category: capitalizedCategory,
          title,
          year
        });
      }
    });
  });
}

// Ensure directory for target file exists
const targetDir = path.dirname(targetFile);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Write to JSON
fs.writeFileSync(targetFile, JSON.stringify(galleryItems, null, 2), 'utf8');
console.log(`Successfully generated gallery items list with ${galleryItems.length} images at ${targetFile}`);
