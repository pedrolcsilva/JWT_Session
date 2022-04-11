const apiURL = "http://localhost:8000/"

async function checkLogin(){
  try {
    await fetch(apiURL + 'getcookie/', {
      method: 'POST',
      credentials: "include",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      return response.json();
    })
    .then(text => {
        console.log(text)
        if(text != true){
          window.location.href = '/';
        }
    })

    .catch(function(error) {
      console.log('Request failed', error);
    });

    await fetch(apiURL + 'checkAdm/', {
      method: 'POST',
      credentials: "include",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      return response.json();
    })
    .then(text => {
        console.log(text)
        if(text == true){
          window.location.href = '/admPage';
        }
    })

    .catch(function(error) {
      console.log('Request failed', error);
    });
  }
  catch (e) {
    console.log(e);
  }
}

checkLogin();


async function showTable(){
  try{
    await fetch(apiURL + 'showUsers', {
      method: 'GET',
      credentials: "include",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data);
      document.getElementById('modal').innerHTML = (`
      <table cellpadding="5px" cellspacing="0" id="alter">
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>  
              Usernames
            </th>
          </tr>
        </thead>
        <tbody id="users">
        </tbody>
    </table>`);
    data.forEach((element, index) => {
      if(index % 2 == 0){
        document.getElementById('users').innerHTML += (`
        <tr>
          <td>
            ${element.name}
          </td>
          <td>
            ${element.username}
          </td>
        </tr>
        `);
      }else{
        document.getElementById('users').innerHTML += (`
        <tr class="dif">
          <td>
            ${element.name}
          </td>
          <td>
            ${element.username}
          </td>
        </tr>
        `);
      }
      
    });
    })
    .catch(err => {
      console.log(err);
    })
  } catch (e){
    console.log(e);
  } 
}

showTable()

document.getElementById("logout").addEventListener('click', () => {
    fetch(apiURL + 'logout/', {method: 'GET',
      credentials: "include",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        return new Error('falhou a requisição') 
      }

      if (response.status === 401) {
        return new Error(response);
      }

      if(response.status == 201){
        console.log("Request complete! response:", response);
      }   
      return response.text();
    })
    .then(text => {
      console.log(text)
      window.location.href = '/';
      
    })

    .catch(function(error) {
      console.log('Request failed', error);
    });
})