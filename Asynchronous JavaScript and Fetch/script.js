const cache = {};
let currentPokemon = null;

async function findPokemon() {
  const input = document.getElementById('pokemon-input').value.trim().toLowerCase();
  if (!input) return;

  const errorMsg = document.getElementById('error-msg');
  errorMsg.style.display = 'none';

  try {
    let data;
    if (cache[input]) {
      data = cache[input];
    } else {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
      if (!response.ok) throw new Error('Not found');
      data = await response.json();
      cache[input] = data;
    }

    currentPokemon = data;
    renderPokemon(data);
  } catch (e) {
    errorMsg.style.display = 'block';
  }
}

function renderPokemon(data) {
  // Image
  const img = document.getElementById('pokemon-img');
  img.src = data.sprites.front_default || '';
  img.alt = data.name;
  img.style.display = 'block';

  // Audio cry
  const audio = document.getElementById('pokemon-audio');
  const cry = (data.cries && (data.cries.latest || data.cries.legacy)) || '';
  audio.src = cry;
  audio.load();

  // Populate all 4 dropdowns with the pokemon's moves
  const moves = data.moves.map(m => m.move.name);
  ['move1', 'move2', 'move3', 'move4'].forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = '';
    moves.forEach(move => {
      const opt = document.createElement('option');
      opt.value = move;
      opt.textContent = move;
      sel.appendChild(opt);
    });
  });
}

function addToTeam() {
  if (!currentPokemon) return;

  const selectedMoves = [
    document.getElementById('move1').value,
    document.getElementById('move2').value,
    document.getElementById('move3').value,
    document.getElementById('move4').value,
  ];

  const member = document.createElement('div');
  member.className = 'team-member';

  // Left cell: image
  const imgCell = document.createElement('div');
  imgCell.className = 'team-member-img-cell';
  const imgEl = document.createElement('img');
  imgEl.src = currentPokemon.sprites.front_default || '';
  imgEl.alt = currentPokemon.name;
  imgCell.appendChild(imgEl);

  // Right cell: moves
  const movesCell = document.createElement('div');
  movesCell.className = 'team-member-moves-cell';
  const moveList = document.createElement('ul');
  moveList.className = 'team-member-moves';
  selectedMoves.forEach(move => {
    const li = document.createElement('li');
    li.textContent = move;
    moveList.appendChild(li);
  });
  movesCell.appendChild(moveList);

  member.appendChild(imgCell);
  member.appendChild(movesCell);

  const teamList = document.getElementById('team-list');
  teamList.style.display = 'block';
  teamList.appendChild(member);
}

// Allow Enter key to trigger search
document.getElementById('pokemon-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') findPokemon();
});