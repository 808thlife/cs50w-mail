document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  //function sending emails
  compose()
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#single-email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Showing the related emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
      const element = document.createElement('div');
      element.className = "single-email";
      if (email.read == true){
        element.style.background = "gray";
      }
      else {
          element.style.background = "purple";
      }
      
      element.innerHTML = `
      <h6>From: ${email.sender}</h6>
      <h5>Subject: ${email.subject}</h5>
      <p>Timestamp: ${email.timestamp}</p>
      
      `;
      //when user clicks email shows up;
      element.addEventListener('click', function() {
      read(email.id)
      fetch(`emails/${email.id}`)
      .then(response => response.json())
      .then(email => {
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'none';
        document.querySelector('#single-email').style.display = 'block';
        document.querySelector('#single-email').innerHTML = `
        <div class = "email-info">
        <ul class="list-group">
          <li class="list-group-item">From: ${email.sender}</li>
          <li class="list-group-item">From: ${email.recipients}</li>
          <li class="list-group-item">Timestamp: ${email.timestamp}</li>
          <li class="list-group-item">Subject: ${email.subject}</li>
        </ul>
        </div>
        <div class ="email-body"><p>Body: <br>${email.body}</p></div>
        `;

        //archive/unarchive

        const btn = document.createElement('button');
        btn.innerHTML = email.archived ? "Unarchive":"Archive";
        btn.className = email.archived ? "btn btn-danger": "btn btn-success";
        btn.addEventListener('click',function(){
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: !email.archived
            })
          })
        })
        document.querySelector('#single-email').append(btn);
        
      })
});
document.querySelector('#emails-view').append(element);  
  });
});

}

//write and send an email
function compose(){
  document.querySelector("#compose-form").addEventListener('submit', (event)=>{
    event.preventDefault();
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result)
      
      return false;
    })
  }) 
}


//marks an email as read when it's clicked
function read(id){
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read:true
    })
  })
}
