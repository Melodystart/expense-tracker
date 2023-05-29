1. 功能描述 (features)：   

  使用者可以註冊帳號並登入/登出，註冊資料：名字、email、密碼、確認密碼  
  使用者可以瀏覽自己的全部記帳並加總金額  
  使用者可以選擇排序記帳的方式
  使用者可以選擇分類篩選記帳並加總篩選分類的金額
  使用者可以新增記帳(單筆/次)  
  使用者可以修改記帳(單筆/次)
  使用者可以刪除記帳(單筆/次)        

2. 安裝與執行步驟 (installation and execution)：   

． 將本專案clone至本機位置   
  git clone https://github.com/Melodystart/expense-tracker.git  

． cd進入至專案資料夾restaurant_list3，並執行以下安裝套件及執行程式指令   
  npm install     
  npm i express    
  npm install -g nodemon    
  npm i express-handlebars    
  npm install dotenv --save    
  npm install method-override      
  npm i -g express-generator     
  npm install --save handlebars-helpers       
  npm install bcryptjs      
  npm install express-session       
  npm install passport         
  npm install passport-facebook    
  npm install passport-local       
  npm install connect-flash     

． 請自行新增.env檔案並將以下資訊儲存於檔案中    
  MONGODB_URI= "您的MongoDB連線資訊"

． 載入種子資料(執行程式指令)  
  npm run seed

． 啟動伺服器  (執行程式指令)  
  nodemon app.js

3. 環境建置與需求 (prerequisites)：   

  bootstrap: ^5.2.3,   
  express: ^4.18.2,   
  express-handlebars: ^6.0.7   
  mongoose: ^7.0.0  
  dotenv: ^16.0.3  
  method-override: ^3.0.0     
  handlebars-helpers: "^0.10.0"            
  bcryptjs: "^2.4.3"      
  connect-flash: "^0.1.1"      
  express-session: "^1.17.3"      
  passport": "^0.6.0"      
  passport-facebook: "^3.0.0"      
  passport-local: "^1.0.0"      