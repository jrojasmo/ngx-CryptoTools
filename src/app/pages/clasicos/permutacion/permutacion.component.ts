import { Component } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TextUtilService } from '../../common-services/text-util.service';
import { DialogoComponent } from '../../dialogo/dialogo.component';

@Component({
  selector: 'ngx-permutacion',
  styleUrls: ['./permutacion.component.scss'],
  templateUrl: './permutacion.component.html',
})
export class PermutacionComponent {

  model1 = {
    textoClaro: '',
    claveString: '',
    textoCifrado: ''
  }
  
  model2 = {
    textoCifrado: '',
    claveString: '',
    textoClaro: ''
  }

  model3 = {
    textoCifrado: '',
    claveString: '',
    textoClaro: ''
  }

  longitudesClave = '';

  constructor(private dialogService: NbDialogService, private util: TextUtilService) {}

  cifrar(textoClaro, clave) {
    try {
      clave = JSON.parse(clave);
      if (this.isAValidPermutation(clave)) {
        this.model1.textoCifrado = this.permutationCipher(textoClaro, clave);
      } else {
        this.showClaveIncorrecta();
      }
    } catch (e) {
      this.showClaveIncorrecta();
    }
  }

  descifrar(textoCifrado, clave) {
    try {
      clave = JSON.parse(clave);
      if (this.isAValidPermutation(clave)) {
        this.model2.textoClaro = this.permutationDecipher(textoCifrado, clave);
      } else {
        this.showClaveIncorrecta();
      }
    } catch (e) {
      this.showClaveIncorrecta();
    }
  }

  generarClave($event, model) {
    $event.preventDefault();
    var size = Math.floor(Math.random() * (10 - 4)) + 4;
    model.claveString = JSON.stringify(this.ranPermutation(size));
  }

  analizar(textoCifrado) {
    this.longitudesClave = JSON.stringify(this.getAllPermutationLen(textoCifrado));
  }

  clearForm($event, model) {
    $event.preventDefault();
    model.textoClaro = '';
    model.textoCifrado = '';
    model.claveString = '';
    if (model == this.model3) this.longitudesClave = '';
  }  

  showClaveIncorrecta() {
    this.dialogService.open(DialogoComponent, {
      context: {
        title: 'Clave Incorrecta',
        content: 'La clave debe ser un arreglo num??rico que represente una permutaci??n de caracteres como: [8, 4, 6, 7, 2, 5, 3, 1]'
      },
    });
  }

  // Funci??n que cifra con un permutaci??n (permutation) un texto (clearText).
  // La permutaci??n es un arreglo que guarda en la i-??sima posici??n el lugar a d??nde permuta la letra.
  // Fue necesario rellenar con 'x' el texto al final para que la longitud fuera un m??ltiplo del tama??o de la permutaci??n y as??
  // no perder informaci??n al final del texto.
  permutationCipher(clearText, permutation) {
      if (this.isAValidPermutation(permutation)) {
          var normalTextCodes = this.util.getCharCodes(
            this.util.normalizeInput(clearText)
          );
          var m = permutation.length;
          var indexPerm = 0;
          var auxList;
          for (var i = 0; i < normalTextCodes.length; i++) {
              indexPerm = i % m;
              if (indexPerm == 0) {
                  auxList = normalTextCodes.slice(i, i + m);
                  while (auxList.length < m) {
                      auxList.push(23);
                      normalTextCodes.push(23);
                  }
              }
              normalTextCodes[i] = auxList[permutation.indexOf(indexPerm + 1)];
          }
          return this.util.codesToString(normalTextCodes);
      }
      return "Invalid permutation.";
  }

  // Funci??n que decifra un texto cifrado (cipherText) con una permutaci??n, sabiendo la permutaci??n inversa (si inversePerm=true)
  // o dada la permutaci??n original se calcula su inversa para poder decifrar.
  permutationDecipher(cipherText, permutation, inversePerm=false) {
      if (inversePerm) {
          return this.permutationCipher(cipherText, permutation);
      } else {
          var permutationInv = new Array();
          for (var i = 0; i < permutation.length; i++) {
              permutationInv[permutation[i] - 1] = i + 1;
          }
          return this.permutationCipher(cipherText, permutationInv);
      }
  }

  // Funci??n que revisa si una permutaci??n es v??lida o no.
  isAValidPermutation(permutation) {
      var dupMap = {};
      for (var i = 0; i < permutation.length; i++) {
          if (permutation[i] < 1 || permutation[i] > permutation.length)
              return false;
          // Verificar duplicados.
          if (dupMap[permutation[i]]) return false;
          dupMap[permutation[i]] = true;
      }
      return true;
  }

  // Ejemplo para permutationCipher y permutationDecipher
  /* console.log(
      permutationCipher(
          `I have a dream that my four little children will one day 
          live in a nation where they will not be judged by the color 
          of their skin but by the content of their character`, 
          [8, 4, 6, 7, 2, 5, 3, 1]
      )
  );
  console.log(
      permutationDecipher(
          `redhaavimhtaamtetriflouydhlliectoilelnwrvyieldanintianaet
          eenrwhonilelywhgjdtubeoctedhbyehotlforobkniirsectethbyufno
          ntteoarhhceitxexarctr`,
          [8, 4, 6, 7, 2, 5, 3, 1]
      )
  ); */

  // Funci??n que retorna una permutaci??n aleatoria de tama??o (size).
  ranPermutation(size) {
      var arr = new Array(size);
      for (var i = 0; i < arr.length; i++) arr[i] = i + 1;
      var j;
      var temp;
      for (var i = arr.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
      }
      return arr;
  }

  // Funci??n que retorna las posibles longitudes de la permutaci??n de un texto (strText) cifrado
  getAllPermutationLen(strText) {
      var n = this.util.normalizeInput(strText).length;
      var divisors = [n];
      if (n==1) {
          return divisors.push(1);
      }
      for (var i = 2; i * i <= n; ++i){
          if (n % i == 0) {
              divisors.push(i);
              if (i != n / i) 
                  divisors.push(n / i);
          }
      }
      return divisors;
  }

  /*console.log(
      getAllPermutationLen(
          `redhaavimhtaamtetriflouydhlliectoilelnwrvyieldanintianaet
          eenrwhonilelywhgjdtubeoctedhbyehotlforobkniirsectethbyufno
          ntteoarhhceitxexarctr`
      )
  );*/

  }
