// ============================================================
// Usta Mehmet — site script.js
// Bu dosyada üç şey var:
// 1) Footer'daki yılı otomatik güncelleme
// 2) SSS bölümünde soruya tıklayınca cevabın açılıp kapanması
// 3) Teklif formu gönderildiğinde Formspree üzerinden e-postana
//    iletilmesi ve ekrana sonuç mesajı gösterilmesi
//    (Formspree endpoint'i: https://formspree.io/f/mpqglgev
//     Bu adresi değiştirmen gerekirse aşağıdaki fetch satırındaki
//     URL'i kendi yeni endpoint'inle değiştirmen yeterli.)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- 1) Footer yılı ----
  var yilSpan = document.getElementById('yil');
  if (yilSpan) {
    yilSpan.textContent = new Date().getFullYear();
  }

  // ---- 2) SSS akordeon ----
  var sorular = document.querySelectorAll('.sss-soru');

  sorular.forEach(function (soruButon) {
    soruButon.addEventListener('click', function () {
      var oge = soruButon.closest('.sss-ogesi');
      var cevap = oge.querySelector('.sss-cevap');
      var acikMi = oge.classList.contains('acik');

      // Önce açık olan başka bir soru varsa kapat (tek seferde bir cevap açık kalsın)
      document.querySelectorAll('.sss-ogesi.acik').forEach(function (acikOge) {
        if (acikOge !== oge) {
          acikOge.classList.remove('acik');
          acikOge.querySelector('.sss-cevap').style.maxHeight = null;
          acikOge.querySelector('.sss-soru').setAttribute('aria-expanded', 'false');
        }
      });

      if (acikMi) {
        oge.classList.remove('acik');
        cevap.style.maxHeight = null;
        soruButon.setAttribute('aria-expanded', 'false');
      } else {
        oge.classList.add('acik');
        cevap.style.maxHeight = cevap.scrollHeight + 'px';
        soruButon.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- 3) Teklif formu ----
  var form = document.getElementById('teklif-formu');
  var durumYazisi = document.getElementById('form-durum');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ad = form.querySelector('#ad').value.trim();
      var telefon = form.querySelector('#telefon').value.trim();
      var hizmet = form.querySelector('#hizmet').value;

      if (!ad || !telefon || !hizmet) {
        durumYazisi.textContent = 'Lütfen adın, telefonun ve iş türünü doldur.';
        durumYazisi.className = 'goster';
        return;
      }

      // ===== FORM GÖNDERİMİ =====
      // Form verisi Formspree'ye gönderiliyor, oradan senin
      // e-postana iletiliyor. Formspree adresini değiştirmen
      // gerekirse aşağıdaki URL'i kendi endpoint'inle değiştir.

      var gonderButon = form.querySelector('.form-gonder');
      var eskiYazi = gonderButon.textContent;
      gonderButon.disabled = true;
      gonderButon.textContent = 'Gönderiliyor...';

      fetch('https://formspree.io/f/mpqglgev', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (yanit) {
          if (yanit.ok) {
            durumYazisi.textContent = 'Teşekkürler ' + ad + '! En kısa zamanda seni arayacağım.';
            durumYazisi.className = 'goster basarili';
            form.reset();
          } else {
            durumYazisi.textContent = 'Bir şeyler ters gitti, lütfen doğrudan ara: 05XX XXX XX XX';
            durumYazisi.className = 'goster';
          }
        })
        .catch(function () {
          durumYazisi.textContent = 'Bağlantı sorunu oldu, lütfen doğrudan ara: 05XX XXX XX XX';
          durumYazisi.className = 'goster';
        })
        .finally(function () {
          gonderButon.disabled = false;
          gonderButon.textContent = eskiYazi;
        });
    });
  }

});
