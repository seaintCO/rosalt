
const observer = new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting) entry.target.classList.add('active')})},{threshold:.08});
document.querySelectorAll('.reveal,.reveal-scale').forEach(el=>observer.observe(el));
if(window.lucide) lucide.createIcons();

document.querySelectorAll('[data-demo-form]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const status=form.querySelector('[data-form-status]');
    if(status) status.textContent='Saved as a local demo request. Connect your backend or form service before launch.';
    try{localStorage.setItem('rosalt-project-request', JSON.stringify(Object.fromEntries(new FormData(form).entries())))}catch(err){}
  });
});
