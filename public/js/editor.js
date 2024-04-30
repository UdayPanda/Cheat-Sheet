// let container = document.getElementsByClassName('container');
const title = document.getElementById("title");
const content = document.getElementById("content");
const language = document.getElementById("language");
const publishBtn = document.getElementById("form-btn");

// Saving Data into Database
publishBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (title.value.length && content.value.length) {

        // access firestore with db variable

        db.collection("codes").add({
            title: title.value,
            content: content.value,
            language: language.value,
        }).then(() => {
            console.log(language.value);
            alert('Added Successfully!');
            window.location.reload();
        }).catch((err) => {
            alert(err);
        })
    }
    else {
        alert("Please enter valid data!");
    }
});

//Fetching Data from Database

const renderCode = (content) => {
    let data = content.data();
    let container = document.querySelector('.container');

    let contentBox = document.createElement('div');
    contentBox.classList.add('content-box');

    let title = document.createElement('div');
    title.classList.add('title');
    title.textContent = data.title;

    let contentElement = document.createElement('div');
    contentElement.classList.add('content');
    let preElement = document.createElement('pre');
    preElement.classList.add('language-' + data.language);
    let codeElement = document.createElement('code');
    codeElement.textContent = data.content;
    preElement.appendChild(codeElement);
    contentElement.appendChild(preElement);

    let removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.setAttribute('data-id', content.id);
    removeBtn.textContent = 'Remove';

    contentBox.appendChild(title);
    contentBox.appendChild(contentElement);
    contentBox.appendChild(removeBtn);

    container.appendChild(contentBox);
}

db.collection('codes').get().then((snapshot) => {
    let container = document.querySelector('.container');
    if (snapshot.empty) {
        container.innerHTML = '<div>Sorry! There is nothing to show.</div>';
    } else {
        snapshot.docs.forEach(content => {
            renderCode(content);
            // console.log(content.data());
        });
    }
});


//Deleting data
document.addEventListener('DOMContentLoaded', () => {

    document.body.addEventListener('click', (event) => {

        if (event.target.classList.contains('remove-btn')) {
            const docId = event.target.getAttribute('data-id');
            // console.log(docId);

            db.collection('codes').doc(docId).get().then((doc) => {
                if (doc.exists) {
                    const title = doc.data().title;
                    const userConfirmation = window.prompt(`Are you sure to delete "${title}"? (y/n)`);

                    if (userConfirmation === "y") {
                        db.collection("codes").doc(docId).delete().then(() => {
                            alert('Deleted Successfully!');
                            window.location.reload();
                        }).catch((err) => {
                            console.error(err);
                        });
                    }
                } else {
                    alert('Document not found!');
                }
            }).catch((error) => {
                console.error('Error getting document:', error);
            });
        }
    });
});

// Searching data

const titles = [];
db.collection("codes").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        var title = doc.data().title;
        titles.push(title);
    })
})

// console.log(titles)

var searchQuery = document.getElementById('search-query');

async function handleKeyPress() {
    document.querySelector('.suggestions').style.display = 'none';
    const query = searchQuery.value.trim();
    // console.log(query);

    let container = document.querySelector('.container');
    container.innerHTML = '';

    try {
        const querySnapshot = await db.collection('codes')
            .orderBy('title')
            .startAt(query)
            .endAt(query + '\uf8ff')
            .get();

        querySnapshot.forEach(function (doc) {
            var data = doc.data();
            renderCode(doc);
        });
    } catch (error) {
        console.log("Error getting documents: ", error);
    }
}

searchQuery.addEventListener('keypress', async (event) => {
    
    if (event.key === 'Enter') {
        await handleKeyPress();
    
    }

    var matched = [];
    
    titles.forEach((t) => {
        if (t.toLowerCase().includes(searchQuery.value.trim().toLowerCase())) {
            // console.log('yes contains');
            matched.push(t);
        }
    })
    // console.log(matched)

    var suggestionBox = document.querySelector('.suggestions');
    var suggestionUL = document.querySelector('.suggestionUL');

    if(suggestionUL.innerHTML != ""){
        suggestionUL.innerHTML = ""
        suggestionBox.style.display = 'block';
        matched.forEach((e)=>{
            suggestionUL.innerHTML += `<li class="list">${e}</li>`;
        })
        const list = document.querySelectorAll('.list');
        list.forEach((l)=>{
            l.addEventListener('click', (event)=>{
                searchQuery.value = event.target.innerHTML;
                suggestionBox.style.display = 'none';
                handleKeyPress();
            })
        })
    }
    else{
        suggestionBox.style.display = 'none';
    }

});