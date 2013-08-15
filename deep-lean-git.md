 ## Git 深入学习笔记
---
### 细节概念  
* CVS === 版本控制系统
* 工作目录树 === woking copy === 断面视图  ！= 版本库
* 每次commit 都会新增加一个版本
* checkout === 检出 === 更新工作目录树到指定的历史版本
* 版本库日志信息 === log Message === commit message
* 上游版本库 === upstream repo === push 过去的repo
* pull === fetch + merge
* git 底层存储不是以文件为单位， 而是以文件部分为单位， 字符/行 + meta data
* 乐观锁机制， 两个人可以同时checkout上游版本库， 可以同时提交（冲突提示）

---
### git config
* 命令: `git config --global --list`  
  列出当前的配置

* 命令: `git config --global user.name "name"`  `git config --global user.email "email"`  
  全局usr信息配置

* 命令: `git config --global color.ui "auto"`  
  输出高亮， false 去除高亮， always同auto

---
### 从基本用法切入
```  
 git init
 touch haha.html
 git status
 git add haha.html
 git commit haha.html
 git log -1 

```
 * git init  
 	1. git存放代码有三个地方
	2. 工作目录树 + index 暂存区(stage area) + 版本库
	3. index 相当于一个缓存库

 * status 操作做了什么---  
	1. git 搜索工作树，输出与Head的文件变化信息 
	2. changes to be commited 在stage area中还没有commit的更改
	3. changes not staged for commited  还没有提交到stage area 的更改
	2. untracked -- 新添加的文件， 未被记录到
	3. modifiled -- 文件已经更改过
	

 * add 操作做了什么：   
	1. add 命令表示将新文件 or 更改过的文件提交到暂存区。
	2. 这里将haha.html 添加到暂存区

 * commit 操作做了什么：  
 	1. 创建一条提交记录。
	2. 放在版本库的历史记录当中， 标记出代码的演进。
	3. 在提交的时候添加 user信息 和 -m 信息。
 	4. 生成40位的 SHA-1 哈希码。
	5. 取hash码的前7位输出打印在控制台中(7位基本上已经可以唯一标识一个commit了)。  

 * log 操作输出上一次提交信息：  
	1. hash码输出的是完整的40位。
	2. user信息
	3. -m 信息

### add -i
* git add -i -- 以交互方式来提交， 如果想只提交新增加的文件， 或者只提交有过更改的文件， 或者部分文件， 可以通过 添加 -i参数  
	1. status -- 显示当前的文件跟踪信息， 与进入 -i模式相同
	2. update -- 选择的方式将代码提交到index中去， 加*表示成功
	3. revert -- update的反操作
	4. add  untracked -- 提交新添加的文件
	5. patch 补丁模式 可通过 git add -p 快捷进入

### commit
* git commit -a  
  不用add， 直接重工作目录提交全部更新到版本库中。
* git log --pretty=oneline

### 远程

* git clone repo_uri local-dir  
  将远程仓库克隆到本地， local-dir可以不添加， 添加则表示克隆到这个目录下面， 否这新建目录为仓库名。

### 分支那些细节

```  
 git branch 
 git branch -r
 git branch rb1.0 master
 .... //在rb1.0上面做了一些提交
 .... //master上面也做了一些提交
 git tag tag-1.0 rb1.0
 git tag
 git checkout master
 git rebase rb1.0
 git branch -d rb1.0
 git branch rb1.0.1 tag-1.0
 git checkout rb1.0.1
```
 * git branch -- 输出当前分支的名字
 * git branch -r -- 输出上游repo的所有分支
 * git branch rb1.0 master -- 在master上面创建一个release branch
 * master 和 branch都做了一些改变， 现在需要在master上面发布rb2.0 
 * git rebase rb1.0 --   
	1. rebase 变基， 将一条分支上面的修改在另外一条分支的末梢重现， 举例有A,B分支， 分叉点为版本Y， 在分支B上变基到A所做的事情就是， 将重Y到B  
	   所有提交按照顺序添加到A的末梢当中， 生成新的分支B及其末梢， 分支A及其末梢没有任何变化。
	2. 这里就是 master 变基到rb1.0的末梢。
 * git branch -d rb1.0  
	1. 删除分支rb1.0
 	2. 这里只是删除了分支名字， 并未删除实际分支提交， 因为之前的tag保存了root到tag的所有提交， 只要checkout tag就可以重现分支了
 * git branch rb1.0.1 tag-1.0 -- 这里就重现了之前的分支

### git patch

* git apply patch



### 更多的命令
1. 将现在的库强制与repo的状态同步
   git checkout -- .

2. git reset命令可以将不要的commit干掉。 
    当然只限于本地，如果push了之后好像就不行了。
   git reset <COMMIT>
   加上--hard参数的时候可以把工作目录也同时更新。

3. git log的好用的参数
   git log --stat  ：可以显示commit的一些统计信息
   git log -p ：可以更详细的信息
   git log master..c1 : 显示从master到c1分支之间的commit的log  
   git log master...c1 : 显示两个分支之间的不共享的commit的log  
     其中两个点和三个点的区别：  
      比如说分支是下面这样的状态的时候，  
      master..c1显示的是F, G  
      master...c1显示的是C, D, E, F, G  
        A ---- B ---- C ---- D ---- E (master)  
                   \-----F ----  G (c1)  



  
















	




















