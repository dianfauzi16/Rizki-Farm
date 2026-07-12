// Simple Login System
window.checkLogin = function() {
  const pass = document.getElementById('adminPassword').value;
  if(pass === 'admin123') {
    document.getElementById('loginOverlay').classList.add('is-hidden');
  } else {
    alert('Password salah!');
  }
};

window.handleImageUpload = function(event, targetId) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 1200; // Kompresi ukuran maksimal agar database tidak jebol
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
      } else {
        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Konversi ke format webp/jpeg yang sangat ringan (kualitas 0.7)
      const dataUrl = canvas.toDataURL('image/webp', 0.7);
      
      const targetInput = document.getElementById(targetId);
      if (targetInput) targetInput.value = dataUrl;
      
      // Mengubah teks tombol agar admin tahu berhasil
      const btn = targetInput.nextElementSibling;
      if (btn) {
        btn.textContent = '✔️ Terpilih';
        btn.style.background = '#4CAF50';
        btn.style.color = '#fff';
      }
    }
    img.src = e.target.result;
  }
  reader.readAsDataURL(file);
};

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const form = document.getElementById('cmsForm');
  const saveStatus = document.getElementById('saveStatus');

  // Generate HTML Fields for Products (6 items)
  const productContainer = document.getElementById('product-fields-container');
  let productHTML = `<div class="admin-grid">`;
  for(let i=1; i<=6; i++) {
    productHTML += `
      <div class="cms-item-group">
        <h3>Produk ${i} dari 6</h3>
        <div class="form-group">
          <label>Gambar Produk</label>
          <div class="input-group">
            <input type="text" id="prod_img_${i}" placeholder="assets/gambar.jpg" style="flex:1;">
            <button type="button" class="btn-upload" onclick="document.getElementById('upload_prod_${i}').click()">Pilih Foto</button>
            <input type="file" id="upload_prod_${i}" accept="image/*" style="display:none;" onchange="handleImageUpload(event, 'prod_img_${i}')">
          </div>
        </div>
        <div class="form-group"><label>Kategori</label><input type="text" id="prod_cat_${i}" placeholder="kambing"></div>
        <div class="form-group"><label>Nama Produk</label><input type="text" id="prod_title_${i}"></div>
        <div class="form-group"><label>Deskripsi Pendek</label><textarea id="prod_desc_${i}" rows="2"></textarea></div>
        <div class="form-group"><label>Harga</label><input type="text" id="prod_price_${i}" placeholder="Mulai Rp2.500.000"></div>
      </div>
    `;
  }
  productHTML += `</div>`;
  productContainer.innerHTML = productHTML;

  // Generate HTML Fields for Gallery (6 items)
  const galleryContainer = document.getElementById('gallery-fields-container');
  let galleryHTML = `<div class="admin-grid">`;
  for(let i=1; i<=6; i++) {
    galleryHTML += `
      <div class="cms-item-group">
        <h3>Galeri ${i} dari 6</h3>
        <div class="form-group">
          <label>Gambar Galeri</label>
          <div class="input-group">
            <input type="text" id="gal_img_${i}" placeholder="assets/gambar.jpg" style="flex:1;">
            <button type="button" class="btn-upload" onclick="document.getElementById('upload_gal_${i}').click()">Pilih Foto</button>
            <input type="file" id="upload_gal_${i}" accept="image/*" style="display:none;" onchange="handleImageUpload(event, 'gal_img_${i}')">
          </div>
        </div>
        <div class="form-group"><label>Caption / Overlay Text</label><input type="text" id="gal_cap_${i}"></div>
      </div>
    `;
  }
  galleryHTML += `</div>`;
  galleryContainer.innerHTML = galleryHTML;

  // Input fields mapping
  const inputs = {
    hero_title: document.getElementById('hero_title'),
    hero_desc: document.getElementById('hero_desc'),
    hero_btn: document.getElementById('hero_btn'),
    about_img: document.getElementById('about_img'),
    about_desc: document.getElementById('about_desc'),
    contact_wa: document.getElementById('contact_wa')
  };

  for(let i=1; i<=6; i++) {
    inputs[`prod_img_${i}`] = document.getElementById(`prod_img_${i}`);
    inputs[`prod_cat_${i}`] = document.getElementById(`prod_cat_${i}`);
    inputs[`prod_title_${i}`] = document.getElementById(`prod_title_${i}`);
    inputs[`prod_desc_${i}`] = document.getElementById(`prod_desc_${i}`);
    inputs[`prod_price_${i}`] = document.getElementById(`prod_price_${i}`);
    
    inputs[`gal_img_${i}`] = document.getElementById(`gal_img_${i}`);
    inputs[`gal_cap_${i}`] = document.getElementById(`gal_cap_${i}`);
  }

  // Tab Navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tabContents.forEach(c => c.classList.remove('is-active'));

      tab.classList.add('is-active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('is-active');
    });
  });

  const SUPABASE_URL = 'https://ycncqiszqzsjpimcickn.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljbmNxaXN6cXpzanBpbWNpY2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzM0MDQsImV4cCI6MjA5OTQ0OTQwNH0.Bp0-T0ebvev1AxmkU9Zf2VQnRazyoAI-3q7EK-vLWF8';

  // Load existing data from Supabase
  const loadData = () => {
    fetch(`${SUPABASE_URL}/rest/v1/cms-data?id=eq.1&select=content`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    .then(res => res.json())
    .then(rows => {
      if (rows && rows.length > 0 && rows[0].content) {
        const data = rows[0].content;
        for (const key in inputs) {
          if (data[key] !== undefined && inputs[key]) {
            inputs[key].value = data[key];
          }
        }
      }
    })
    .catch(e => console.error('Error loading CMS data:', e));
  };

  // Save data to Supabase
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btnSave = form.querySelector('.btn-save');
    const originalText = btnSave.textContent;
    btnSave.textContent = 'Menyimpan...';
    
    const data = {};
    for (const key in inputs) {
      if (inputs[key]) {
        data[key] = inputs[key].value;
      }
    }

    fetch(`${SUPABASE_URL}/rest/v1/cms-data?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ content: data })
    })
    .then(res => {
      if (!res.ok) throw new Error('Gagal menyimpan');
      
      btnSave.textContent = originalText;
      saveStatus.textContent = 'Tersimpan di Cloud Database!';
      saveStatus.classList.add('is-visible');
      setTimeout(() => saveStatus.classList.remove('is-visible'), 3000);
    })
    .catch(err => {
      console.error(err);
      btnSave.textContent = originalText;
      alert('Terjadi kesalahan saat menyimpan ke database Supabase!');
    });
  });

  // Initialize
  loadData();
});
