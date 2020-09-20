const $global = {
  colorCardContainer : document.querySelector("#card-container"),
  baseURL : "http://localhost:3000/colors"
}


fetch($global.baseURL)
  .then(response => response.json())
  .then(displayColorCards)

  function displayColorCards(colors){
    colors.forEach(color => {
      const colorCard = createColorCard(color)
      createColorName(color, colorCard)
      createVoteCount(color, colorCard)
      createVoteButton(colorCard, color)
      createDeleteButton(colorCard, color)
    }
)}

function createColorCard(color){
  const colorCard = document.createElement('div')
  colorCard.classList.add("color-card")
  colorCard.style.backgroundColor = color.hex;
  $global.colorCardContainer.append(colorCard)
  return colorCard
}

function createColorName(color, colorCard){
  const colorName = document.createElement('h2')
  colorName.textContent = color.name
  colorCard.append(colorName)
}

function createVoteCount(color, colorCard){
  const voteCount = document.createElement('p')
  voteCount.id = `${color.id}`
  voteCount.textContent = color.votes
  colorCard.append(voteCount)

}

function createVoteButton(colorCard, color){
  const voteButton = document.createElement('button')
  voteButton.textContent = "+1 Vote!"
  colorCard.append(voteButton)
  voteButton.addEventListener('click', () => addVote(color))
}

function createDeleteButton(colorCard, color){
  const deleteButton = document.createElement('button')
  deleteButton.textContent = "X"
  colorCard.append(deleteButton)
  deleteButton.addEventListener('click', () =>  deleteColor(colorCard, color))
}

function addVote(color){
  const votes = document.getElementById(`${color.id}`)
  votes.textContent = color.votes += 1
  fetch(`http://localhost:3000/colors/${color.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify(votes)
  }).then(response => response.json())
  .then(console.log(color))
}

function deleteColor(colorCard, color){
  colorCard.remove()
  fetch(`http://localhost:3000/colors/${color.id}`, {
    method: 'DELETE'
  }).then(response => response.json())
  console.log('card deleted')
}

const form = document.querySelector('form')
form.addEventListener('submit', submitForm)

function submitForm(event){
  event.preventDefault()
  const formData = new FormData(form)
  const name = formData.get('name')
  const hex = formData.get('hex')
  const votes = 0
  const color = { name, hex, votes }
  displayColorCards(color)
  fetch($global.baseURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ name, hex, votes })
  }).then(response => response.json())
}
