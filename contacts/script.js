// Взаимосвязь с сервером
{
  const PATH = "https://jsonplaceholder.typicode.com/users";
  
  const getAjax = () => {
    let ajaxRequest;
    if (window.XMLHttpRequest) { // Chrome, Firefox, Safari
      ajaxRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {  // IE
      try {
        //Для новых версий
        ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        //Для cтарых
        ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    return ajaxRequest;
  }
  
  const XML = getAjax();
  
  XML.open("GET", PATH, true);
  XML.send();
  
  // обработка данных
  XML.onreadystatechange = () => {
      try {
        if (XML.readyState === XMLHttpRequest.DONE) {
          if (XML.status === 200) {
              localStorage.setItem('ContactObject', XML.responseText);
          } else {
            throw Error(`There was a problem with the request. ${XML.status} ${XML.statusText}`);
          }
        }
      } catch (e) {
          throw Error(`Caught Exception: ${e.description}`);
      }
  };
}