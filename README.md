<h1>
vr.js
    <h3>一个简洁的UI框架。</h3>
</h1>

## 安装使用

目前只支持通过script标签引入。

### 安装

全局引用：

```html
<script type="text/javascript" src="./vr.js"></script>
```

## 使用

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
    <div id="app"></div>
    <script src='./vr.js'></script>
    <script>
        new VR({
            app : 'app',
            render(){
                return(
                    div('this is a div')
                    )
            }
        });
    </script>
</body>
</html>
```

Copyright (c) 2019-present, vr.js
