# Instrukcja

## Spis treści
1. Jak sprawdzić czy git jest zainstalowany na komputerze
2. Jak skopiować repozytorium git korzystając z git bash
3. Jak zainstalować node js
4. Jak uruchomić aplikacje

### Jak sprawdzić czy git jest zainstalowany na komputerze
Trzeba otworzyć terminal, najłatwiej to kliknąć w przycisk windowsowy i wpisać CMD.
Następnie trzeba wpisać w terminalu komendę:

git --version

jeżeli output wygląda +/- jak to:

git version 2.38.0.windows.1

To masz zainstalowany git na komputerze. Jeżeli nie masz, to instrukcja jest dostępna pod:
https://github.com/git-guides/install-git


### Jak skopiować repozytorium git korzystając z git bash
W pierwszym kroku potrzebujesz folder w którym chcesz umieścić projekt

weźmy na to przykładową ścieżkę:
"C:\Users\Lenovo\Desktop"

teraz jak stworzymy nowy folder to pojawi się na desktopie:
"C:\Users\Lenovo\Desktop\Nowy Folder"

Jak otworzysz folder, kliknji prawy przycisk myszki i wybierz opcje:

"Git Bash Here"

Otworzy się terminal bashowy, jest inny od terminalu windowsowego(CMD) bo terminal bashowy korzysta z syntaxu linuxowego.
W tym terminalu trzeba zacząć od wystartowania/inicjalizacji git'a:

git init

a następnie trzeba sklonować projekt z repozytorium git:

gh repo clone Liddeldiiz/esp8266LedConcept

żeby robić pushe itd, to jeszcze ogarniemy w sobote(21.01.2023), sam jeszcze nie dawałem wcześniej nikomu takich uprawnień, ale jakoś to ogarniemy.

### Jak zainstalować node js

Do instalacji nodeJs jest napisana dobra instrukcja pod:
https://treehouse.github.io/installation-guides/windows/node-windows.html

zaznacze że jakby wam długo trwał pewien etap instalacji, to jest normalne, mi też trwało na tyle długo że zacząłem podejrzewać jakiś błąd. Ale wszystko zainstalowało się poprawnie.

### Jak uruchomić aplikacje
Zanim uruchomisz aplikacje, musisz jeszcze zainstalować wszystkie "Dependencies". Na stronce:
https://www.knowledgehut.com/blog/web-development/npm-install-dev-dependencies

jest opisane jak to zrobić z narzędziami "npm" oraz "yarn".

W moim repozytorium jest plik "package.json". Za pomocą jego możesz zainstalować wszystkie zależności, przynajmiej tak powinno zadziałać w teorii:

npm install package.json --save-dev

