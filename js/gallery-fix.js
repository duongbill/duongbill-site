/**
 * Gallery hover effect fix
 * This script replaces all picture-o icons with search-plus icons
 * and ensures the hover effect works properly
 */
document.addEventListener('DOMContentLoaded', function() {
    // Replace all picture-o icons with search-plus icons
    const galleryIcons = document.querySelectorAll('.gallery-single .hoverbutton i.fa-picture-o');
    galleryIcons.forEach(icon => {
        icon.classList.remove('fa-picture-o');
        icon.classList.add('fa-search-plus');
    });
    
    // Make sure all hover buttons are visible
    const hoverButtons = document.querySelectorAll('.gallery-single .hoverbutton');
    hoverButtons.forEach(button => {
        button.style.transform = 'scale(1)';
        button.style.opacity = '0.7';
    });
    
    // Add hover effect to gallery items
    const galleryItems = document.querySelectorAll('.gallery-single');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const button = this.querySelector('.hoverbutton');
            if (button) {
                button.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const button = this.querySelector('.hoverbutton');
            if (button) {
                button.style.opacity = '0.7';
            }
        });
    });
});
