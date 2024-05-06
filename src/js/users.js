fetch("https://randomuser.me/api/?results=12&inc=name,nat,location,picture,registered,email")
    .then(function(data){
        return data.json()
    })
    .then(function(data){
        console.log(data);
        for (let i = 0; i < data.results.length; i++) {
            //usercard
            const userList = document.getElementById('users');
            const userCard = document.createElement('section');
            //img
            let figure = document.createElement('figure');
            let img = document.createElement('img');
            img.setAttribute('src', data.results[i].picture.large);
            img.setAttribute('alt', 'user profile picture');
            figure.appendChild(img);
            //name
            let name = document.createElement('p');
            name.textContent = `${data.results[i].name.title}. ${data.results[i].name.first} ${data.results[i].name.last}`;
            //country
            let country = document.createElement('p');
            country.textContent = `Land: ${data.results[i].location.country}`;
            //birth date
            let birthDate = document.createElement('p');
            let dateT = data.results[i].registered.date.indexOf('T');
            let date = data.results[i].registered.date.substring(0, dateT)
            birthDate.textContent = `Geboortedatum: ${date}`;
            //insert
            userCard.appendChild(figure);
            userCard.appendChild(name);
            userCard.appendChild(country);
            userCard.appendChild(birthDate);
            userList.appendChild(userCard);
            userCard.classList.add('user');
        }
    })
