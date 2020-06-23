let deferredInstallPrompt = null;
const botaoInstalar = document.getElementById('btInstalar');

let initialiseUI = function(){
    botaoInstalar.removeAttribute('hidden');
    botaoInstalar.addEventListener('click', function(){

        deferredInstallPrompt.prompt();

        deferredInstallPrompt.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){

                console.log("Usuário aceitou a instalação");

            }else{

                console.log("Usuário não aceitou a instalação");

            }

        });

    });

}

window.addEventListener('beforeinstallprompt', gravarEvento);

function gravarEvento(evt){
    console.log("teste");
    deferredInstallPrompt = evt;
}


//Carregar conteúdo do servidor
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    if(ajax.readyState == 4 && ajax.status == 200){
        var data = ajax.responseText;
        var data_json = JSON.parse(data);
        var conteudo = document.getElementById('park_content');

        if(data_json.home_cards.length == 0){

            conteudo.innerHTML = '<div class="row"><div class="col-12"><div class="alert alert-danger" role="alert">Nenhum parque cadastrado!</div></div></div>';

        } 
        else {

            var html_conteudo = '<div class="col-12 my-2 park-card-title text-center">Encontre os melhores parques!</div>';

            for(var i=0; i < data_json.home_cards.length; i++){
                html_conteudo+= park_card(data_json.home_cards[i].alt, data_json.home_cards[i].title, data_json.home_cards[i].location, data_json.home_cards[i].href, data_json.home_cards[i].img, data_json.home_cards[i].description,data_json.home_cards[i].grade);
            }

            //Gravar a criação dos elementos
            conteudo.innerHTML = html_conteudo;
            cache_cards(data_json);
        }
    }
}

//Template do Card de Parques
let park_card = function(alt, title, location, href, img, description, grade){

    let grade_class_color = '';

    if(grade < 5) {
        grade_class_color = 'bad';
    } 

    else if(grade == 5) {
        grade_class_color = 'medium';
    } 

    else if(grade > 5 && grade < 8) {
        grade_class_color = 'good';
    } 

    else if(grade >= 8) {
        grade_class_color = 'great';
    } 

    return  '<div class="col-12 mb-4 park-list">' +
                '<a href="'+ href + '">' +
                    '<div class="card">' +
                        '<img src="'+ img +'" class="card-img-top" alt="'+ alt +'">' +
                        '<div class="card-body">' +
                            '<p class="card-title">'+ title +'</p>' +
                            '<span class="card-location">'+ location +'</span>' +
                            '<span class="card-text">'+ description +'</span>' +
                            '<span class="float-right"><span class="card-grade '+ grade_class_color +'">'+ grade +'</span>/10</span>' +
                        '</div>' +
                    '</div>' +
                '</a>' +
            '</div>';

}

//Cache conteúdo dinâmico
var cache_cards = function(data_json){

    if('caches' in window){

        caches.delete('wet-track-app-conteudo').then(function(){

            console.log('Deletando cache de conteúdo antigo');

            if(data_json.length > 0){

                var files = ['dados.json'];

                //Entrando na categoria
                for(var i = 0; i < data_json.length; i++){

                    //Entrando no item
                    for(var j = 0; j < data_json[i].itens.length; j++){
                        if(files.indexOf(data_json[i].itens[j].imagem) == -1){
                            files.push(data_json[i].itens[j].imagem);
                        }
                    }
                }

                caches.open('wet-track-app-conteudo').then(function (cache){

                    cache.addAll(files).then(function(){
                        console.log("Arquivos de conteúdo cacheados!");
                    });

                });
            }

        });

    }
}
