const globalCommonFunc = {
  loaderStart: function(){
    const spinner =`<div id="loading-screen">
                        <div id="loading-spinner"></div>
                        <div id="loading-text">Sending data...</div>
                    </div>`;
    const parseDoc = new DOMParser().parseFromString(spinner, `text/html`).querySelector('#loading-screen');
    document.body.append(parseDoc);
  },
  loaderStop: function(){
    document.querySelector('#loading-screen').remove();
  },
  validateForm: function (parentEl) {
    let errors = 0;

    parentEl.querySelectorAll('input[required], textarea[required]').forEach((item) => {

        if (item.value) {
            item.removeAttribute('style');
        }
        else {
            errors += 1;

            item.setAttribute('style', 'border: 1px solid red');
        }

    });

    return errors == 0 ? true : false;
  },
  alert: function(alert_type, alert_mssg){
    const alertdiv = `<div class="alert-cont"><div class="${alert_type}" id="success-alert">
                        <span class="closebtn">&times;</span>
                        <strong>${alert_mssg}</strong>
                    </div></div>`;
    const parseDoc = new DOMParser().parseFromString(alertdiv, 'text/html').querySelector('.alert-cont');

    parseDoc.querySelector('.closebtn').addEventListener('click', () =>{

      document.querySelector('.alert-cont').remove();

    });

    document.body.append(parseDoc);
  }
}

window.addEventListener('scroll', function() {
  var header = document.querySelector('header');
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollPosition > 0) {
    header.classList.add('fixed');
  } else {
    header.classList.remove('fixed');
  }
});

function sendEmail() {
  
  if(!globalCommonFunc.validateForm(document.querySelector('.contact-cont'))){
    return;
  }

  globalCommonFunc.loaderStart();

  let phone_num = document.querySelector('.phone_num').value;
  let company_name = document.querySelector('.company_name').value;
  let fullname = document.querySelector('.fullname').value;
  let email = document.querySelector('.email').value;
  let message = document.querySelector('.message').value;
  
  fetch('/api/send-email/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(), 
    },
    body: JSON.stringify({phone_num, company_name, fullname, email, message})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data, " -- data")
    if (data.success) {
      // Email sent successfully, handle the success response
      globalCommonFunc.alert('alert-success','Message Sent Successfully! wait for admin to reply.');
    } else {
      // Email sending failed, handle the error response
      globalCommonFunc.alert('alert-error','Sending Message Failed!');
    }
  })
  .catch(error => {
    // Error occurred during the request, handle the error
    globalCommonFunc.alert('alert-error', error);
    
  })
  .finally(() =>{

    document.querySelector('.phone_num').value = "";
    document.querySelector('.company_name').value = "";
    document.querySelector('.fullname').value = "";
    document.querySelector('.email').value = "";
    document.querySelector('.message').value = "";


    globalCommonFunc.loaderStop();
    
  });
}
  // Helper function to get the CSRF token
const getCsrfToken = () => {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return '';
};