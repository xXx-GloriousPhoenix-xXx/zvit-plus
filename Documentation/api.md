# API Functionality
### Authorization
|Operation|Guest|User|Mod|Admin|
|-|:-:|:-:|:-:|:-:|
|Register|✔|❌|❌|❌|
|Login|✔|❌|❌|❌|
|Logout|❌|✔|✔|✔|
|Refresh|❌|✔|✔|✔|

### Template, Report
|Operation|Guest|User|Mod|Admin|
|-|:-:|:-:|:-:|:-:|
|Create|❌|✔|✔|✔|
|Read|✔|✔|✔|✔|
|Update|❌|Own|Own|✔|
|Delete|❌|Own|Own & All Users|✔|
|Search|✔|✔|✔|✔|
|Get Own|❌|✔|✔|✔|
|Export|✔|✔|✔|✔|

### User
|Operation|Guest|User|Mod|Admin|
|-|:-:|:-:|:-:|:-:|
|Grant Role|❌|❌|❌|✔|
|Ban, Unban|❌|❌|✔|✔|
