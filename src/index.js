const fs = require('fs');
const util = require('util');
var clc = require("cli-color");

const Cities = require('../files/Cidades.json');
const States = require('../files/Estados.json');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const existFile = util.promisify(fs.exists);

const citiesGroupByStates =()=>{
    try {
        const splitedAnMerge = States.map(state => {
            const { ID, Sigla } = state;
            const cities = Cities.filter( city => city.Estado === ID );
            return {state: Sigla, cities};
        });
        return splitedAnMerge;
    } catch (error) {
        return [];
    }
}
const generateAndWriteFiles =async ()=>{
    const statesAndCities = citiesGroupByStates();
    for( let i =0; i< statesAndCities.length ; i=i+1){
        const { state, cities } = statesAndCities[i];
        await writeFile(`jsons/${state}.json`,JSON.stringify(cities));
    }
}

const readStateByCode= async(name)=>{
    try {
        const stateString =await readFile(`jsons/${String(name).toUpperCase()}.json`,'utf8');
        const cities = JSON.parse(stateString);
        return cities;
    } catch (error) {
        console.log(error);
    }
   
}
const ordenation = (arrayOfStates=[]) =>{
    try {
        const done = arrayOfStates;
        for( i in arrayOfStates){
            let bubble = arrayOfStates[i];
            if(i>0){
                for(let j = i-1; j>=0; j=j-1 ){
                    if(bubble.cities.length < arrayOfStates[j].cities.length){
                        const aux = arrayOfStates[j+1];
                        arrayOfStates[j+1] = arrayOfStates[j];
                        arrayOfStates[j] = aux;
                    }
                   
                }
            }
        }
        return done;
    } catch (error) {
        return [];
    }
   
}
const fiveTopState = ()=>{
    try {
        const statesAndCities = ordenation(citiesGroupByStates());
        const result = statesAndCities.reverse().slice(0,5);

        let toPrint ='[';
        result.forEach(state=>{
            toPrint+=`${state.state}-${state.cities.length},`;
        });
        toPrint+=']';
        
        return toPrint.replace(',]',']');
        
    } catch (error) {
        return [];
    }
}
const fiveDownState = () =>{
    try {
        const statesAndCities = ordenation(citiesGroupByStates());
        const result = statesAndCities.slice(0,5);

        let toPrint ='[';
        result.reverse().forEach(state=>{
            toPrint+=`${state.state}-${state.cities.length},`;
        });
        toPrint+=']';
        
        return toPrint.replace(',]',']');
        
    } catch (error) {
        return [];
    }
}

const bigNameCityOfState = ()=>{
    const statesAndCities = citiesGroupByStates();
    const filtrado = statesAndCities.map(state =>{
         const ordenados = state.cities.sort((a,b)=>
         {
            const avaliar = b.Nome.length - a.Nome.length;
            if(avaliar===0){
                return b.Nome < a.Nome;
            }
            return avaliar;    
        });
        const [city] = ordenados;
        return `${city.Nome} - ${state.state}`;
    });
    return filtrado;
}

const smallNameCityOfState = ()=>{
    const statesAndCities = citiesGroupByStates();
    const filtrado = statesAndCities.map(state =>{
         const ordenados = state.cities.sort((a,b)=>
         {
            const avaliar = a.Nome.length - b.Nome.length;
            if(avaliar===0){
                return a.Nome < b.Nome;
            }
            return avaliar;    
        });
        const [city] = ordenados;
        return `${city.Nome} - ${state.state}`;
    });
    return filtrado;
}

const resultado = async() =>{
console.log(clc.bgYellow('Item 01 - Criando arquivos'));
    await generateAndWriteFiles();
console.log(clc.bgGreen('Item 01 - Criado'));

console.log(clc.bgYellow('Item 02 - Lendo arquivo de Goias'));
    const cidades = await readStateByCode('GO');
    console.log(clc.blue(`Goias tem ${cidades.length} cidades.`))
console.log(clc.bgGreen('Item 02 - Feito'));

console.log(clc.bgGreen('Item 03 - Cinco estados com mais cidades'));
    console.log(clc.blue(fiveTopState()));

console.log(clc.bgGreen('Item 04 - Cinco estados com menos cidades'));
    console.log(clc.blue(fiveDownState()));    

console.log(clc.bgGreen('Item 05 - Maiores nomes de cidades por estado'));
    console.log(clc.blue(`[${bigNameCityOfState()}]`));  

console.log(clc.bgGreen('Item 06 - Menores nomes de cidades por estado'));
    console.log(clc.blue(`[${smallNameCityOfState()}]`)); 

console.log(clc.bgGreen('Item 07 - Maior nome de cidade'));
    console.log(clc.blue(bigNameCityOfState()[0]));   

console.log(clc.bgGreen('Item 08 - Menor nome de cidade'));
    console.log(clc.blue(smallNameCityOfState()[0])); 
}


resultado();
