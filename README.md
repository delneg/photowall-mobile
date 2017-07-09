# 1. Структура API для работы приложения

Все данные передаются и возвращаются в формате JSON.

В целях упрощения представлена авторизация по логину и паролю, однако сервер также может вернуть token пользователя, авторизовавшегося через социальную сеть.

## 1.2 Авторизация

/api-token-auth

**Авторизация:**
Не требуется

**Метод:**
POST

**Отправляемые данные:**
username – строка, имя пользователя

password – строка, пароль

**Возвращаемые данные:**

token – токен авторизации пользователя

При ошибках – в возвращаемых данных в полях username и password соответственно содержаться ошибки для каждого из полей.

## 1.3 Получение списка мероприятий

/events/

**Авторизация:**
Не требуется

**Метод:**

GET

**Формат возвращаемых данных:**
[ {

      &quot;id&quot;: 3,

      &quot;name&quot;: &quot;Blockchain &amp; Bitcoin Conference St. Petersburg&quot;,

      &quot;description&quot;: &quot;Уникальное мероприятиe на территории СНГ и Европы, которое соберёт вместе истинных криптоголиков для определения понятия «Blockchain» и его влияния на будущее финансовой системы мира.&quot;,

      &quot;start\_date&quot;: &quot;2017-06-22T06:00:00+0000&quot;,

      &quot;end\_date&quot;: &quot;2017-06-22T20:00:00+0000&quot;,

      &quot;image\_set&quot;: [

        {

          &quot;id&quot;: 37,

          &quot;image&quot;: &quot;/media/images/data-image-jpeg\_16.jpeg&quot;,

          &quot;uploaded\_by&quot;: {

            &quot;id&quot;: &quot;a5488ad7-d32d-4e92-9844-e968069dd41c&quot;,

            &quot;username&quot;: &quot;username&quot;,

            &quot;first\_name&quot;: &quot;&quot;,

            &quot;last\_name&quot;: &quot;&quot;

          },

          &quot;event&quot;: 3,

          &quot;published&quot;: true,

          &quot;created\_at&quot;: &quot;2017-06-12T18:56:44+0000&quot;,

          &quot;comment&quot;: &quot;&quot;

        },

      ]

]

## 1.4 Получение данных о конкретном мероприятии

/event/{id}

**Авторизация:**

Не требуется

**Метод:**
GET

**Отправляемые данные:**
id – идентификатор мероприятия, число

**Формат возвращаемых данных:**

{&quot;id&quot;: 3,

  &quot;name&quot;: &quot;Blockchain &amp; Bitcoin Conference St. Petersburg&quot;,

  &quot;description&quot;: &quot;Уникальное мероприятиe на территории СНГ и Европы, которое соберёт вместе истинных криптоголиков для определения понятия «Blockchain» и его влияния на будущее финансовой системы мира.&quot;,

  &quot;start\_date&quot;: &quot;2017-06-22T06:00:00+0000&quot;,

  &quot;end\_date&quot;: &quot;2017-06-22T20:00:00+0000&quot;,

  &quot;image\_set&quot;: [

    {

      &quot;id&quot;: 37,

      &quot;image&quot;: &quot;/media/images/data-image-jpeg\_16.jpeg&quot;,

      &quot;uploaded\_by&quot;: {

        &quot;id&quot;: &quot;a5488ad7-d32d-4e92-9844-e968069dd41c&quot;,

        &quot;username&quot;: &quot;username&quot;,

        &quot;first\_name&quot;: &quot;&quot;,

        &quot;last\_name&quot;: &quot;&quot;

      },

      &quot;event&quot;: 3,

      &quot;published&quot;: true,

      &quot;created\_at&quot;: &quot;2017-06-12T18:56:44+0000&quot;,

      &quot;comment&quot;: &quot;&quot;

    }]}

## 1.5 Загрузка фотографии к мероприятию

/image/upload

**Авторизация:**
Требуется

**Метод:**

POST

**Отправляемые данные:**

image – фотография

comment – комментарий

event – идентификатор мероприятия

**HTTP headers:**

headers: {
   **&#39;Content-Type&#39;** : **&#39;multipart/form-data&#39;** ,
   **&#39;Authorization&#39;** : **&#39;Token &#39;** + **token**
}

**Формат возвращаемых данных:**

{

  &quot;id&quot;: 38,

  &quot;image&quot;: &quot;photo\_2017-05-19\_19-56-51.jpg&quot;,

  &quot;event&quot;: 3,

  &quot;comment&quot;: &quot;&quot;}
