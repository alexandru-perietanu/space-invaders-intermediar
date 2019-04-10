document.addEventListener("DOMContentLoaded", start);

function start() {
    var body = document.body;
    var gameManager = new GameManager();
    body.appendChild(gameManager.getElement());
}