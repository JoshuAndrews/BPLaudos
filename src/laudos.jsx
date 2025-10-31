import React, { useState, useEffect } from 'react';
import './laudos.scss';
import logo from './Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faSmile } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";


function Laudos() {
    const [macroTexto, setMacroTexto] = useState("");
    const [laudoGerado, setLaudoGerado] = useState("");
    const [especificacoes, setEspecificacoes] = useState([]);
    const [botaoVisivel, setBotaoVisivel] = useState(true);
    const [mostrarDivs, setMostrarDivs] = useState(false);
    const [maiuculo, setMaiusculo] = useState(false);
    const [negrito, setNegrito] = useState(false);
    const [linhas, setLinhas] = useState(false);
    const [laudoOriginal, setLaudoOriginal] = useState('');
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [mostrarAlertaC, setMostrarAlertaC] = useState(false);
    const [animando, setAnimando] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);
    const [temaEscuro, setTemaEscuro] = useState(false);

    const alternarMenu = () => {
        setMenuAberto(!menuAberto);
    };

const handleGerarLaudos = () => {
    if (macroTexto.trim() !== "") {
        // Normaliza quebras de linha
        const normalizedText = macroTexto.replace(/\r\n/g, '\n');
        
        // Encontra todos os títulos e suas descrições
        const tituloRegex = /^([A-Za-z]|\d{1,2})\)\s*(.*?)([:\-])\s*(.*?)(?=\n([A-Za-z]|\d{1,2})\)|$)/gms;
        const matches = [...normalizedText.matchAll(tituloRegex)];
        
        const titulos = [];

        matches.forEach(match => {
            const identificador = match[1].toUpperCase();
            let titulo = `${identificador}) ${match[2].trim()}:`; // Sempre usa ":"

            // Adiciona "Biópsia prostática." se necessário
            if (!titulo.match(/Biópsia prostática|Próstata|próstata|Biópsia de próstata/i)) {
                titulo = titulo.replace(/^([A-Za-z0-9]\) )/, "$1Biópsia prostática. ");
            }

            // Pega todo o texto da seção para extrair fragmentos
            const textoCompleto = match[0];
            const { fragmento2 } = extrairFragmentos(textoCompleto);

            titulos.push({
                titulo,
                letra: identificador,
                fragmento2: fragmento2.toString().padStart(2, '0')
            });
        });

        // Restante do código...
        const novasEspecificacoes = titulos.map(({ titulo, letra, fragmento2 }) => ({
            titulo,
            letra,
            protocolo: "",
            fragmento2,
            comprometimento: "",
        }));

        setEspecificacoes(novasEspecificacoes);

        const laudosIniciais = titulos.map(({ titulo }) => `${titulo}\nProtocolo não especificado.`);
        setLaudoGerado(laudosIniciais.join('\n\n'));

        setBotaoVisivel(false);
        setMostrarDivs(true);
    } else {
        // Código de alerta...
    }
};

const extrairFragmentos = (texto) => {
    // Procura especificamente o padrão XB/XF no final
    const matchFragmento = texto.match(/(\d+)[Bb]\/(\d+)[Ff](?:\.|\s|$)/);
    const fragmento2 = matchFragmento ? parseInt(matchFragmento[2]) || 0 : 0;
    return { fragmento1: 0, fragmento2 };
};
const processarSecao = (secaoAtual, titulos) => {
    const tituloMatch = secaoAtual.match(/^([A-Za-z]|\d{1,2})\)\s*(.*?)(:|-)\s*/);
    if (tituloMatch) {
        let identificador = tituloMatch[1].toUpperCase();
        let titulo = `${identificador}) ${tituloMatch[2].trim()}:`;

        if (!titulo.match(/Biópsia prostática|Próstata|próstata|Biópsia de próstata/i)) {
            titulo = titulo.replace(/^([A-Za-z0-9]\) )/, "$1Biópsia prostática. ");
        }

        const { fragmento2 } = extrairFragmentos(secaoAtual);

        titulos.push({
            titulo,
            letra: identificador,
            fragmento2: fragmento2.toString().padStart(2, '0')
        });
    }
};


    const atualizarLaudoGerado = (novasEspecificacoes) => {
        const laudosAtualizados = novasEspecificacoes.map((especificacao, index) => {
            const { titulo, protocolo, padrao4, padrao5, comprometimento, asapTamanho, asapBloco, pn, cr, idc, pin, ext, prostatite, desc, descCheckbox, fragmento1, fragmento2 } = especificacao;
    
            let textoProtocolo = `${titulo}\nProtocolo não especificado.`;
    
            const fragmentoTexto = (parseInt(fragmento1) === 1 && parseInt(fragmento2) === 1) ? "fragmento" : "fragmentos";
    
            if (protocolo === "GP1 - 6 (3+3)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 6 (3 + 3), grupo prognóstico 1, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente. ";
                } else {
                    textoProtocolo += "";
                }
                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente. ";
                } else {
                    textoProtocolo += "";
                }
                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN). ";
                } else {
                    textoProtocolo += "";
                }
                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática. ";
                } else {
                    textoProtocolo += "";
                }
                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica. ";
                } else {
                    textoProtocolo += "";
                }
            } else if (protocolo === "GP2 - 7 (3+4)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 7 (3 + 4), com ${padrao4 || "--"}% de padrão 4, grupo prognóstico 2, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente. ";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado. ";
                }
                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente. ";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado. ";
                }
                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }
                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN). ";
                } else {
                    textoProtocolo += "";
                }
                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática. ";
                } else {
                    textoProtocolo += "";
                }
                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica. ";
                } else {
                    textoProtocolo += "";
                }
            } else if (protocolo === "GP4 - 8 (3+5)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 8 (3 + 5), com ${padrao5 || "--"}% de padrão 5, grupo prognóstico 4, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente. ";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado. ";
                }
                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente. ";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado. ";
                }
                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN). ";
                } else {
                    textoProtocolo += "";
                }
                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática. ";
                } else {
                    textoProtocolo += "";
                }
                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica. ";
                } else {
                    textoProtocolo += "";
                }
            } else if (protocolo === "GP3 - 7 (4+3)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 7 (4 + 3), com ${padrao4 || "--"}% de padrão 4, grupo prognóstico 3, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado.";
                }
                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado.";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            } else if (protocolo === "GP4 - 8 (4+4)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 8 (4 + 4), grupo prognóstico 4, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado.";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado.";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            } else if (protocolo === "GP4 - 9 (4+5)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 9 (4 + 5), com ${padrao5 || "--"}% de padrão 5, grupo prognóstico 5, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado.";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado.";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            } else if (protocolo === "GP4 - 8 (5+3)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 8 (5 + 3), com ${padrao5 || "--"}% de padrão 5, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado.";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado.";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            } else if (protocolo === "GP4 - 9 (5+4)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 9 (5 + 4), com ${padrao4 || "--"}% de padrão 5, grupo prognóstico 5, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += " Padrão cribriforme não detectado.";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado.";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            } else if (protocolo === "GP4 - 10 (5+5)") {
                textoProtocolo = `${titulo}\n- Adenocarcinoma acinar usual, escore de Gleason 10 (5 + 5), grupo prognóstico 5, em ${fragmento1 || "--"} de ${fragmento2 || "--"} ${fragmentoTexto} e comprometendo ${comprometimento || "--"}%`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += " do total da amostra.";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += "";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += " Carcinoma intraductal não detectado.";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " Infiltração perineural não detectada.";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            }else if (protocolo === "Tecido sem glândulas") {
                textoProtocolo = `${titulo}\n- Estroma fibromuscular benigno, desprovido de glândulas prostáticas.`;
                if (descCheckbox) {
                    textoProtocolo += ` da amostra, de forma descontínua.`;
                }
                else {
                    textoProtocolo += "";
                }
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += "";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += "";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += "";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }

            } else if (protocolo === "ASAP") {
                return `${titulo}\n- Proliferação de pequenos ácinos atípicos (ASAP), medindo ${asapTamanho || "--"}mm (vide nota).\nNota: é necessário estudo imunoistoquímico complementar para pesquisa de células basais na tentativa de definição diagnóstica (bloco ${asapBloco || "--"}).`;
                ;
            } else if (protocolo === "RTU") {
                return `${titulo}\n- Hiperplasia nodular da próstata.\n- Urotélio sem atipias.\n- Ausência de sinais de malignidade.`;
            } else if (protocolo === "RTU ESTADIAMENTO") {
                return `${titulo}\n- Estadiamento clínico (pTNM / AJCC 8th Edition): cT1a (achado histológico de tumor incidental em 5% ou menos de tecido ressecado).\n- Estadiamento clínico (pTNM / AJCC 8th Edition): cT1b (achado histológico de tumor incidental em >5% de tecido ressecado).`;
            } else if (protocolo === "BX NORMAL") {
                textoProtocolo = `${titulo}\n- Tecido prostático benigno.`;
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += "";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += "";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += "";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }
            } else if (protocolo === "BX ATROFIA") {
                textoProtocolo = `${titulo}\n- Tecido prostático benigno com focos de atrofia acinar.`;
                if (cr) {
                    textoProtocolo += " Padrão cribriforme presente.";
                } else {
                    textoProtocolo += "";
                }

                if (idc) {
                    textoProtocolo += " Carcinoma intraductal presente.";
                } else {
                    textoProtocolo += "";
                }

                if (pn) {
                    textoProtocolo += " Infiltração perineural presente.";
                } else {
                    textoProtocolo += " ";
                }

                if (ext) {
                    textoProtocolo += " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.";
                } else {
                    textoProtocolo += "";
                }

                if (pin) {
                    textoProtocolo += " Neoplasia intraepitelial prostática (PIN).";
                } else {
                    textoProtocolo += "";
                }

                if (prostatite) {
                    textoProtocolo += " Prostatite crônica inespecífica.";
                } else {
                    textoProtocolo += "";
                }
            } else if (protocolo === "CAR INTRADUCTAL") {
                return `${titulo}\n- Presença de carcinoma intraductal.`;
            } else if (protocolo === "COMP CRIBRIFORME") {
                return `${titulo}\n- Presença de componente cribriforme`;
            }

            else {
                let temAdicional = false;

                if (pn) {
                    textoProtocolo = `${titulo}\n- Infiltração perineural presente.`;
                    temAdicional = true;
                }
                if (cr) {
                    textoProtocolo += temAdicional ? " Padrão cribriforme detectado." : `\n${titulo}\n- Padrão cribriforme presente.`;
                    temAdicional = true;
                }
                if (idc) {
                    textoProtocolo += temAdicional ? " Carcinoma intraductal detectado." : `\n${titulo}\n- Carcinoma intraductal presente.`;
                    temAdicional = true;
                }
                if (pin) {
                    textoProtocolo += temAdicional ? " Neoplasia intraepitelial prostática (PIN)." : `\n${titulo}\n- Neoplasia intraepitelial prostática (PIN).`;
                    temAdicional = true;
                }
                if (ext) {
                    textoProtocolo += temAdicional ? " Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática." : `\n${titulo}\n- Presença de infiltração de tecido adiposo, podendo corresponder a extensão extraprostática.`;
                    temAdicional = true;
                }
                if (prostatite) {
                    textoProtocolo += temAdicional ? " Prostatite crônica inespecífica." : `\n${titulo}\n- Prostatite crônica inespecífica.`;
                    temAdicional = true;
                }

                if (!temAdicional) {
                    textoProtocolo = `${titulo}\nProtocolo não especificado.`;
                } else {
                    textoProtocolo = textoProtocolo.replace(`${titulo}\nProtocolo não especificado.`, "").trim();
                }
            }

            return textoProtocolo;
        });

        setLaudoGerado(laudosAtualizados.join('\n\n'));
    };


    const handleProtocoloChange = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].protocolo = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };

    const handleFragmento1Change = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].fragmento1 = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };
    const handlePadrao4Change = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].padrao4 = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };
    const handlePadrao5Change = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].padrao5 = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };

    const handleFragmento2Change = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].fragmento2 = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };

    const handleComprometimentoChange = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].comprometimento = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };
    const handleAsapTamanhoChange = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].asapTamanho = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };
    const handleAsapBlocoChange = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].asapBloco = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };
    const handleExpandir = (index) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].expandido = !novasEspecificacoes[index].expandido;
        setEspecificacoes(novasEspecificacoes);
    };

    const handleCheckboxChange = (index, name, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index][name] = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };

    const handleDescChange = (index, value) => {
        const novasEspecificacoes = [...especificacoes];
        novasEspecificacoes[index].desc = value;
        setEspecificacoes(novasEspecificacoes);
        atualizarLaudoGerado(novasEspecificacoes);
    };

    const ArrowTip = ({ size = 24, color = 'black' }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ verticalAlign: 'middle' }}
        >
            <path d="M6 8L12 16L18 8" />
        </svg>
    );
    const definirTodosComoBenignos = () => {
        const novosLaudos = especificacoes.map(especificacao => ({
            ...especificacao,
            protocolo: "BX NORMAL",
            comprometimento: "",
            pn: false,
            cr: false,
            idc: false,
            pin: false,
            ext: false,
            prostatite: false,
        }));
        setEspecificacoes(novosLaudos);
        atualizarLaudoGerado(novosLaudos);
    };
    const resetarLaudo = () => {
        setMacroTexto("");
        setEspecificacoes([]);
        setLaudoGerado("");
        setBotaoVisivel(true);
        setMostrarDivs(false);
    };
    const toggleMaiusculo = () => {
        setMaiusculo(!maiuculo);
    };
    const toggleNegrito = () => {
        setNegrito(!negrito);
    };
    const toggleLinhas = () => {
        setLinhas(!linhas);
    };
    const aplicarFormatacoes = () => {
        let textoFormatado = laudoOriginal || laudoGerado;

        if (maiuculo) {
            textoFormatado = textoFormatado.toUpperCase();
        }

        if (negrito) {
            textoFormatado = `<span class='negrito'>${textoFormatado}</span>`;
        }

        if (linhas) {
            textoFormatado = `\n${textoFormatado}<br>\n`;
        }

        return textoFormatado;
    };


    const copiarTexto = () => {
        const textoFormatado = aplicarFormatacoes();

        const tempElement = document.createElement('div');
        tempElement.innerHTML = textoFormatado.replace(/\n/g, '<br>');
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        tempElement.style.backgroundColor = '#ffffff';
        document.body.appendChild(tempElement);

        const range = document.createRange();
        range.selectNodeContents(tempElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            setMostrarAlertaC(true);
            setTimeout(() => {
                setMostrarAlertaC(false);
            }, 2000);

        } catch (err) {
            console.error('Falha ao copiar texto', err);
        }

        document.body.removeChild(tempElement);
    };

    useEffect(() => {
        const temaSalvo = localStorage.getItem('tema');
        if (temaSalvo === 'escuro') {
            setTemaEscuro(true);
            aplicarTemaEscuro();
        } else {
            setTemaEscuro(false);
            aplicarTemaClaro();
        }
    }, []);

    const aplicarTemaEscuro = () => {
        const root = document.documentElement;
        root.style.setProperty('--bgd', '#242424');
        root.style.setProperty('--txtP', '#fefefe');
        root.style.setProperty('--labelInt', '#AAAAB9');
        root.style.setProperty('--bgdMacroTexto', '#3a3a3a');
        root.style.setProperty('--txtMacroTexto', '#fff');
        root.style.setProperty('--bgdEspecificacoes', '#3a3a3a');
        root.style.setProperty('--labelEspecificacaoItem', '#fff');
        root.style.setProperty('--selectMenuBorda', '#313131');
        root.style.setProperty('--selectMenuColor', '#d6d6d6');
        root.style.setProperty('--selectMenuBgd', '#333333');
        root.style.setProperty('--inputMenuBorda', '#313131');
        root.style.setProperty('--inputMenuColor', '#d6d6d6');
        root.style.setProperty('--inputMenuBgd', '#333333');
        root.style.setProperty('--menuAddLabel', '#fefefe');
        root.style.setProperty('--laudoBgd', '#3a3a3a');
        root.style.setProperty('--laudoColor', '#fefefe');
        root.style.setProperty('--laudoBtn', '#3a3a3a');
        root.style.setProperty('--trocarTema', '#fff');
        root.style.setProperty('--btnBenigno', '#2b4d63');
        root.style.setProperty('--btnExcluir', '#c25a2e');
        root.style.setProperty('--btnExtense', '#2b4d63');
        localStorage.setItem('tema', 'escuro'); 
    };
    
    const aplicarTemaClaro = () => {
        const root = document.documentElement;
        root.style.setProperty('--bgd', '#eee');
        root.style.setProperty('--txtP', '#000');
        root.style.setProperty('--labelInt', '#6E6D6B');
        root.style.setProperty('--bgdMacroTexto', '#fff');
        root.style.setProperty('--txtMacroTexto', '#313131');
        root.style.setProperty('--bgdEspecificacoes', '#fff');
        root.style.setProperty('--labelEspecificacaoItem', '#313131');
        root.style.setProperty('--selectMenuBorda', '#e1dede');
        root.style.setProperty('--selectMenuColor', '#3d3d3b');
        root.style.setProperty('--selectMenuBgd', '#fff');
        root.style.setProperty('--inputMenuBorda', '#e1dede');
        root.style.setProperty('--inputMenuColor', '#3d3d3b');
        root.style.setProperty('--inputMenuBgd', '#fff');
        root.style.setProperty('--menuAddLabel', '#000');
        root.style.setProperty('--laudoBgd', '#fff');
        root.style.setProperty('--laudoColor', '#000');
        root.style.setProperty('--laudoBtn', '#fff');
        root.style.setProperty('--trocarTema', '#000');
        root.style.setProperty('--btnBenigno', '#005387');
        root.style.setProperty('--btnExcluir', '#ff4e00');
        root.style.setProperty('--btnExtense', '#005387');

        localStorage.setItem('tema', 'claro'); 
    };

    const alterarTema = () => {
        setTemaEscuro(prev => {
            const novoTema = !prev;
            if (novoTema) {
                aplicarTemaEscuro();
            } else {
                aplicarTemaClaro();
            }
            return novoTema;
        });
    };

    return (
        <div className='laudos'>
            <div className="laudos-link-menu">
            <div onClick={alterarTema} className='menuTrocarTema'>
                <span><FontAwesomeIcon icon={temaEscuro ? faMoon : faSun} /></span>
            </div>
            </div>
            <>
                {mostrarAlerta && (
                    <div
                        id="alert-container"
                        className={`alert ${animando ? "fade-out" : ""}`}
                    >
                        <div className="alert-content">
                            <p>Por favor, insira um macro texto. O campo não pode estar vazio.</p>
                        </div>
                    </div>
                )}
            </>
            <header className='laudos-header'>
                <img src={logo} alt="Logo" />
                <p>Seja bem-vindo(a)</p>
            </header>
            <main>
                <div className='laudos-macro-texto'>
                    <label>
                        Macro Texto
                        <span className='icone-macro-texto'>
                            <FontAwesomeIcon icon={faCircleQuestion} title="Digite o Macro Texto no Campo Abaixo" style={{ cursor: 'pointer' }} />
                        </span>
                    </label>
                    <textarea
                        placeholder="Insira o macro texto..."
                        rows="10"
                        cols="50"
                        className="macroTexto"
                        value={macroTexto}
                        onChange={(e) => setMacroTexto(e.target.value)}
                    />
                    {botaoVisivel && (
                        <button onClick={handleGerarLaudos}>
                            <span>+</span>
                            Gerar Laudos
                        </button>
                    )}
                </div>

                {mostrarDivs && (
                    <>
                        <div className='laudos-especificacoes-label'>
                            <label>Especificações<span className='icone-macro-texto'><FontAwesomeIcon icon={faCircleQuestion} title="Preenchimento de Laudos" style={{ cursor: 'pointer' }} /></span></label>
                        </div>
                        <div className='laudos-especificacoes'>
                            {especificacoes.map((item, index) => (
                                <div key={index}>
                                    <div className='especificacao-item'>
                                        <div className='especificacao-item-esq'>
                                            <div className='especificacao-protocolo-conteiner'>
                                                    <div className='especificacao-titulo-conteiner'>
                                                        <p className='especificacao-titulo-p'>{item.letra})</p>
                                                    </div>
                                                    <div className='especificacao-protocolo-conteiner-pr'>
                                                    <div className='laudo-especificacao-label'>
                                                        <label>Protocolo</label>
                                                    </div>
                                                    <div className='laudos-especificacao-input'>
                                                        <select value={item.protocolo} onChange={(e) => handleProtocoloChange(index, e.target.value)}>
                                                            <option value="">Selecione um protocolo</option>
                                                            <option value="BX NORMAL">BX NORMAL</option>
                                                            <option value="GP1 - 6 (3+3)">GP1 - 6 (3+3)</option>
                                                            <option value="GP2 - 7 (3+4)">GP2 - 7 (3+4)</option>
                                                            <option value="GP4 - 8 (3+5)">GP4 - 8 (3+5)</option>
                                                            <option value="GP3 - 7 (4+3)">GP3 - 7 (4+3)</option>
                                                            <option value="GP4 - 8 (4+4)">GP4 - 8 (4+4)</option>
                                                            <option value="GP4 - 9 (4+5)">GP4 - 9 (4+5)</option>
                                                            <option value="GP4 - 8 (5+3)">GP4 - 8 (5+3)</option>
                                                            <option value="GP4 - 9 (5+4)">GP4 - 9 (5+4)</option>
                                                            <option value="GP4 - 10 (5+5)">GP4 - 10 (5+5)</option>
                                                            <option value="Tecido sem glândulas">TECIDO SEM GLÂNDULAS</option>
                                                            <option value="ASAP">ASAP</option>
                                                            <option value="RTU">RTU</option>
                                                            <option value="RTU ESTADIAMENTO">RTU ESTADIAMENTO</option>
                                                            <option value="BX ATROFIA">BX ATROFIA</option>
                                                            <option value="CAR INTRADUCTAL">CAR INTRADUCTAL</option>
                                                            <option value="COMP CRIBRIFORME">COMP CRIBRIFORME</option>
                                                        </select>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className='especificacao-dados-laudos'>
                                                {item.protocolo === "GP1 - 6 (3+3)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP2 - 7 (3+4)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner-p'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Padrão 4</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-p'>
                                                                <input
                                                                    type="number"
                                                                    value={item.padrao4}
                                                                    onChange={(e) => handlePadrao4Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP4 - 8 (3+5)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner-p'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Padrão 5</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-p'>
                                                                <input
                                                                    type="number"
                                                                    value={item.padrao5}
                                                                    onChange={(e) => handlePadrao5Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP3 - 7 (4+3)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner-p'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Padrão 4</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-p'>
                                                                <input
                                                                    type="number"
                                                                    value={item.padrao4}
                                                                    onChange={(e) => handlePadrao4Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP4 - 8 (4+4)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP4 - 9 (4+5)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner-p'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Padrão 5</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-p'>
                                                                <input
                                                                    type="number"
                                                                    value={item.padrao5}
                                                                    onChange={(e) => handlePadrao5Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP4 - 8 (5+3)" && (
                                                    <>
                                                    <div className='especificacao-protocolo-conteiner-p'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Padrão 5</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-p'>
                                                                <input
                                                                    type="number"
                                                                    value={item.padrao5}
                                                                    onChange={(e) => handlePadrao5Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP4 - 9 (5+4)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner-p'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Padrão 5</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-p'>
                                                                <input
                                                                    type="number"
                                                                    value={item.padrao4}
                                                                    onChange={(e) => handlePadrao4Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "GP4 - 10 (5+5)" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Número de Fragmentos:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento1}
                                                                    onChange={(e) => handleFragmento1Change(index, e.target.value)}
                                                                />
                                                                <span style={{ padding: '0em 0.2em' }}>de</span>
                                                                <input
                                                                    type="number"
                                                                    value={item.fragmento2}
                                                                    onChange={(e) => handleFragmento2Change(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Percentual Comprometido:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="number"
                                                                    value={item.comprometimento}
                                                                    onChange={(e) => handleComprometimentoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {item.protocolo === "ASAP" && (
                                                    <>
                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Tamanho (mm):</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input'>
                                                                <input
                                                                    type="number"
                                                                    value={item.asapTamanho}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        const formattedValue = value && !value.includes('.') ? `${value}.0` : value;
                                                                        handleAsapTamanhoChange(index, formattedValue);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='especificacao-protocolo-conteiner'>
                                                            <div className='laudo-especificacao-label'>
                                                                <label>Bloco:</label>
                                                            </div>
                                                            <div className='laudos-especificacao-input-d'>
                                                                <input
                                                                    type="text"
                                                                    value={item.asapBloco}
                                                                    onChange={(e) => handleAsapBlocoChange(index, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                        </div>
                                        <div className='especificacao-item-dir'>
                                            <div className='especificacao-laudo-botao-add'>
                                                <button onClick={() => handleExpandir(index)}>
                                                    <span><ArrowTip color="white" size={16} /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`opcoes-adicionais ${item.expandido ? 'show' : ''}`}>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.pn}
                                                onChange={(e) => handleCheckboxChange(index, 'pn', e.target.checked)}
                                                id='pn'
                                            />
                                            <label><span title='Infiltração perineural'>PN</span></label>
                                        </div>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.cr}
                                                onChange={(e) => handleCheckboxChange(index, 'cr', e.target.checked)}
                                                id='cr'
                                            />
                                            <label><span title='Padrão cribriforme'>CR</span></label>
                                        </div>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.idc}
                                                onChange={(e) => handleCheckboxChange(index, 'idc', e.target.checked)}
                                                id='idc'
                                            />
                                            <label><span title='Carcinoma intraductal'>IDC</span></label>
                                        </div>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.pin}
                                                onChange={(e) => handleCheckboxChange(index, 'pin', e.target.checked)}
                                                id='pin'
                                            />
                                            <label><span title='Neoplasia intraepitelial prostática'>PIN</span></label>
                                        </div>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.ext}
                                                onChange={(e) => handleCheckboxChange(index, 'ext', e.target.checked)}
                                                id='ext'
                                            />
                                            <label for="ext"><span title="Infiltração de tecido adiposo (possível extensão extraprostática).">EXT</span></label>
                                        </div>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.prostatite}
                                                onChange={(e) => handleCheckboxChange(index, 'prostatite', e.target.checked)}
                                                id='prostatite'
                                            />
                                            <label><span title='Prostatite crônica inespecífica.'>Prostatite</span></label>
                                        </div>
                                        <div className='opp'>
                                            <input
                                                type="checkbox"
                                                checked={item.descCheckbox}
                                                onChange={(e) => handleCheckboxChange(index, 'descCheckbox', e.target.checked)}
                                                id={`descCheckbox-${index}`}
                                            />
                                            <label htmlFor={`descCheckbox-${index}`}>
                                                <span title='Descontinuo.'>Desc</span>
                                            </label>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='botoes-acoes'>
                            <button onClick={definirTodosComoBenignos} className='btn-benigno'>
                                <span><FontAwesomeIcon icon={faSmile} /> Todos Benignos</span>
                            </button>
                            <button onClick={resetarLaudo} className='btn-excluir'>
                                <span><FontAwesomeIcon icon={faTrash} /> Excluir Tudo</span>
                            </button>
                        </div>

                        <div className='laudos-gerado-label'>
                            <label>Laudo Gerado<span className='icone-macro-texto'><FontAwesomeIcon icon={faCircleQuestion} title="Texto do Laudo Concluído" style={{ cursor: 'pointer' }} /></span></label>
                        </div>
                        <div className='laudos-laudo-gerado'>
                            <>
                                {mostrarAlertaC && (
                                    <div className="alert">
                                        <div className="alert-content">
                                            <p>Copiado com sucesso!</p>
                                        </div>
                                    </div>
                                )}
                            </>
                            <div className='laudos-laudo-cabecalho'>
                                <div className='laudo-cabecalho-esquerda'>
                                    <button className={`botao-checkbox ${maiuculo ? 'ativo' : ''}`} onClick={toggleMaiusculo} title='Maiúsculo ou minúsculo'>Aa</button>
                                    <button className={`botao-checkbox ${negrito ? 'ativo' : ''}`} onClick={toggleNegrito} title='Negrito'><b>B</b></button>
                                    <button className={`botao-checkbox ${linhas ? 'ativo' : ''}`} onClick={toggleLinhas} title='Espaçamento'>↕</button>
                                </div>
                                <div className='laudo-cabecalho-direita'>
                                    <button onClick={copiarTexto} title="Clique para copiar"><span><FontAwesomeIcon icon={faCopy} /></span></button>
                                </div>
                            </div>
                            <pre dangerouslySetInnerHTML={{ __html: aplicarFormatacoes() }}></pre>
                        </div>

                    </>
                )}
            </main>
        </div>
    );
}

export default Laudos;
