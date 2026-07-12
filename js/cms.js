/* ==========================================================================
   RZFARM — CMS Fetcher
   Script ini bertugas membaca data dari localStorage dan menerapkannya 
   ke dalam Landing Page (index.html) saat dimuat.
   ========================================================================== */

const SUPABASE_URL = 'https://ycncqiszqzsjpimcickn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbmNxaXN6cXpzanBpbWNpY2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzM0MDQsImV4cCI6MjA5OTQ0OTQwNH0.Bp0-T0ebvev1AxmkU9Zf2VQnRazyoAI-3q7EK-vLWF8';

document.addEventListener('DOMContentLoaded', () => {
  fetch(`${SUPABASE_URL}/rest/v1/cms-data?id=eq.1&select=content`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  .then(res => res.json())
  .then(rows => {
    if (!rows || rows.length === 0) return;
    const data = rows[0].content;
    if (!data) return;

    try {

    // 1. Update Hero Section
    if (data.hero_title) {
      const heroTitle = document.querySelector('.hero__title');
      if (heroTitle) heroTitle.innerHTML = data.hero_title; // Menggunakan innerHTML agar tag <br> berfungsi
    }

    if (data.hero_desc) {
      const heroDesc = document.querySelector('.hero__desc');
      if (heroDesc) heroDesc.textContent = data.hero_desc;
    }

    if (data.hero_btn) {
      const heroBtn = document.querySelector('.hero__content .btn--primary');
      if (heroBtn) heroBtn.textContent = data.hero_btn;
    }

    // 2. Update About Section
    if (data.about_img) {
      const aboutImg = document.querySelector('.about__art img');
      if (aboutImg) aboutImg.src = data.about_img;
    }

    if (data.about_desc) {
      const aboutDesc = document.querySelector('.about__content .section-desc');
      if (aboutDesc) {
        // Karena deskripsi aslinya ada beberapa paragraf, 
        // kita bisa menimpa paragraf pertama saja atau membuat tag p baru.
        // Di sini kita timpa teks utamanya:
        aboutDesc.textContent = data.about_desc;
      }
    }

    // 3. Update Contact (WhatsApp Links)
    if (data.contact_wa) {
      // Membersihkan nomor (menghapus spasi, +, dll jika ada)
      const cleanWa = data.contact_wa.replace(/\D/g, '');
      const waLinks = document.querySelectorAll('a[href^="https://wa.me"]');
      
      waLinks.forEach(link => {
        link.href = `https://wa.me/${cleanWa}`;
      });
    }

    // 4. Update Products (6 Items)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
      const i = index + 1;
      if (data[`prod_cat_${i}`]) card.dataset.category = data[`prod_cat_${i}`].toLowerCase();
      
      const img = card.querySelector('img');
      if (img && data[`prod_img_${i}`]) img.src = data[`prod_img_${i}`];
      
      const title = card.querySelector('.product-card__title');
      if (title && data[`prod_title_${i}`]) title.textContent = data[`prod_title_${i}`];
      
      const desc = card.querySelector('.product-card__desc');
      if (desc && data[`prod_desc_${i}`]) desc.textContent = data[`prod_desc_${i}`];
      
      const price = card.querySelector('.product-card__price');
      if (price && data[`prod_price_${i}`]) price.textContent = data[`prod_price_${i}`];
      
      const tag = card.querySelector('.product-card__tag');
      if (tag && data[`prod_cat_${i}`]) {
        tag.textContent = data[`prod_cat_${i}`].charAt(0).toUpperCase() + data[`prod_cat_${i}`].slice(1);
      }
    });

    // 5. Update Gallery (6 Items)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      const i = index + 1;
      
      if (data[`gal_cap_${i}`]) {
        item.dataset.caption = data[`gal_cap_${i}`];
        const overlay = item.querySelector('.gallery-item__overlay');
        if (overlay) overlay.textContent = data[`gal_cap_${i}`];
      }
      
      const img = item.querySelector('img');
      if (img && data[`gal_img_${i}`]) img.src = data[`gal_img_${i}`];
    });

  } catch (e) {
    console.error('Error applying CMS data:', e);
  }
  })
  .catch(err => console.error('Supabase fetch error:', err));
});
