// 轮播图配置
const carouselConfig = {
    // Unsplash随机图片API，可配置不同主题
    imageThemes: ['pinduoduo', 'shopping', 'ecommerce', 'promotion', 'sale'], // 轮播图使用的图片主题，可以根据需要选择不同主题
    // 轮播图片数量
    imageCount: 3, // 设置要显示的轮播图片数量
    // 自动轮播间隔（毫秒）
    interval: 3000, // 每次轮播间隔3秒
    // 随机模式：true表示每次加载随机图片，false表示固定图片列表
    randomMode: true // 是否开启随机模式，true时每次加载随机图片，false时固定图片列表
};

// 轮播图类
class Carousel {
    constructor(containerId) {
        // 获取轮播图容器
        this.container = document.getElementById(containerId);
        // 存储轮播图元素
        this.slides = [];
        // 存储指示器元素
        this.indicators = [];
        // 当前显示的轮播图索引
        this.currentIndex = 0;
        // 轮播图自动播放的定时器ID
        this.intervalId = null;
        // 配置参数
        this.config = carouselConfig;

        // 初始化轮播图
        this.init();
    }

    // 初始化轮播图
    init() {
        this.createSlides(); // 创建轮播图
        this.createNavigation(); // 创建导航按钮
        this.createIndicators(); // 创建指示器
        this.startAutoPlay(); // 启动自动轮播
        this.bindEvents(); // 绑定事件（如鼠标悬停停止自动轮播）
    }

    // 创建轮播图片
    createSlides() {
        // 创建轮播图容器
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'banner-container';

        // 根据配置的图片数量生成轮播图
        for (let i = 0; i < this.config.imageCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'banner-slide'; // 每一项轮播图的样式

            const img = document.createElement('img');
            img.src = `./img/${i}.webp`; // 设置图片路径
            img.alt = `轮播图 ${i + 1}`; // 设置图片描述

            slide.appendChild(img); // 将图片添加到轮播项中
            slidesContainer.appendChild(slide); // 将轮播项添加到轮播图容器中
            this.slides.push(slide); // 将当前轮播图项添加到slides数组中
        }

        // 将轮播图容器添加到页面中
        this.container.appendChild(slidesContainer);
        this.showSlide(0); // 默认显示第一张轮播图
    }

    // 创建导航按钮
    createNavigation() {
        const navContainer = document.createElement('div');
        navContainer.className = 'banner-nav';

        // 创建上一张按钮
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '‹'; // 设置按钮文本为“‹”
        prevBtn.addEventListener('click', () => this.prevSlide()); // 点击按钮时显示上一张图片

        // 创建下一张按钮
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '›'; // 设置按钮文本为“›”
        nextBtn.addEventListener('click', () => this.nextSlide()); // 点击按钮时显示下一张图片

        navContainer.appendChild(prevBtn); // 将上一张按钮添加到导航容器
        navContainer.appendChild(nextBtn); // 将下一张按钮添加到导航容器
        this.container.appendChild(navContainer); // 将导航容器添加到轮播图容器中
    }

    // 创建指示器
    createIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'banner-indicators';

        // 创建每个指示器，并绑定点击事件
        for (let i = 0; i < this.config.imageCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator'; // 设置指示器的样式
            indicator.addEventListener('click', () => this.showSlide(i)); // 点击指示器时显示对应的轮播图
            indicatorsContainer.appendChild(indicator); // 将指示器添加到指示器容器中
            this.indicators.push(indicator); // 将指示器添加到indicators数组中
        }

        // 将指示器容器添加到轮播图容器中
        this.container.appendChild(indicatorsContainer);
        this.updateIndicators(0); // 更新指示器，默认选中第一个
    }

    // 显示指定索引的轮播图
    showSlide(index) {
        // 隐藏当前的轮播图
        this.slides[this.currentIndex].classList.remove('active');

        // 更新当前显示的轮播图索引
        this.currentIndex = index;

        // 显示新的轮播图
        this.slides[this.currentIndex].classList.add('active');

        // 更新指示器状态
        this.updateIndicators(index);
    }

    // 更新指示器状态
    updateIndicators(activeIndex) {
        this.indicators.forEach((indicator, index) => {
            // 如果指示器的索引与当前显示的轮播图索引相同，添加“active”类，否则移除
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // 上一张
    prevSlide() {
        let newIndex = this.currentIndex - 1; // 当前索引减1
        if (newIndex < 0) { // 如果索引小于0，回到最后一张
            newIndex = this.slides.length - 1;
        }
        this.showSlide(newIndex); // 显示上一张轮播图
    }

    // 下一张
    nextSlide() {
        let newIndex = this.currentIndex + 1; // 当前索引加1
        if (newIndex >= this.slides.length) { // 如果索引超出最大值，回到第一张
            newIndex = 0;
        }
        this.showSlide(newIndex); // 显示下一张轮播图
    }

    // 开始自动播放
    startAutoPlay() {
        this.intervalId = setInterval(() => {
            this.nextSlide(); // 每隔设定的时间切换到下一张轮播图
        }, this.config.interval); // 使用config中的interval作为时间间隔
    }

    // 停止自动播放
    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId); // 清除定时器
            this.intervalId = null;
        }
    }

    // 绑定事件
    bindEvents() {
        // 鼠标悬停时停止自动播放
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        // 鼠标离开时恢复自动播放
        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    // 确保轮播图容器存在
    if (document.getElementById('banner')) {
        // 创建并初始化轮播图
        window.carousel = new Carousel('banner');
    }
});

// 打开登录注册框
function openAuth() {
    document.getElementById("authBox").style.display = "flex"; // 显示登录/注册弹窗
    document.getElementById("authMsg").innerText = ""; // 清空错误信息
}

// 关闭弹窗
function closeAuth() {
    document.getElementById("authBox").style.display = "none"; // 关闭登录/注册弹窗
}

// 退出登录
function logOut() {
    document.querySelector(".nav ul li:nth-child(2) a").innerText = "注册 / 登录"; // 更新导航栏显示为“注册 / 登录”
    localStorage.setItem("currentUser", ""); // 清空当前用户的登录信息
    closeAuth(); // 关闭弹窗
    // 提示用户已退出登录
    alert("您已退出登录");
}

// 注册
function register() {
    const username = document.getElementById("username").value.trim(); // 获取输入的用户名
    const password = document.getElementById("password").value.trim(); // 获取输入的密码

    if (!username || !password) {
        document.getElementById("authMsg").innerText = "用户名或密码不能为空"; // 如果用户名或密码为空，提示错误
        return;
    }

    if (localStorage.getItem("user_" + username)) {
        document.getElementById("authMsg").innerText = "用户名已存在"; // 如果用户名已存在，提示错误
        return;
    }

    localStorage.setItem("user_" + username, password); // 将用户名和密码存储到localStorage
    document.getElementById("authMsg").innerText = "注册成功，请登录"; // 提示用户注册成功
}

// 登录
function login() {
    const username = document.getElementById("username").value.trim(); // 获取输入的用户名
    const password = document.getElementById("password").value.trim(); // 获取输入的密码

    const savedPwd = localStorage.getItem("user_" + username); // 获取存储的密码

    if (!savedPwd) {
        document.getElementById("authMsg").innerText = "用户不存在"; // 用户名不存在时，提示错误
        return;
    }

    if (savedPwd !== password) {
        document.getElementById("authMsg").innerText = "密码错误"; // 密码错误时，提示错误
        return;
    }

    localStorage.setItem("currentUser", username); // 登录成功，存储当前用户信息
    alert("登录成功，欢迎你：" + username); // 提示用户登录成功
    closeAuth(); // 关闭登录框
    updateUserStatus(); // 更新用户登录状态
}

// 更新导航栏显示
function updateUserStatus() {
    const user = localStorage.getItem("currentUser"); // 获取当前用户
    if (user) {
        document.querySelector(".nav ul li:nth-child(2) a").innerText = "欢迎，" + user; // 如果有用户，显示欢迎信息
    }
}

// 页面加载时检查登录状态
document.addEventListener("DOMContentLoaded", updateUserStatus);

// 购物车跳转
function goCart() {
    const user = localStorage.getItem("currentUser"); // 获取当前用户
    if (!user) {
        alert("请先登录"); // 如果用户未登录，提示登录
        openAuth(); // 打开登录框
        return;
    }
    window.location.href = "cart.html"; // 如果已登录，跳转到购物车页面
}

// 加入购物车
function addToCart(event, name, price) {
    event.preventDefault(); // 阻止默认行为，防止跳转

    const user = localStorage.getItem("currentUser"); // 获取当前用户
    if (!user) {
        alert("请先登录"); // 如果用户未登录，提示登录
        openAuth(); // 打开登录框
        return;
    }

    const key = "cart_" + user; // 购物车存储的键名
    let cart = JSON.parse(localStorage.getItem(key)) || []; // 获取购物车数据

    // 查找是否已有该商品
    const item = cart.find(p => p.name === name);
    if (item) {
        item.count++; // 如果已有该商品，数量加1
    } else {
        cart.push({ name, price, count: 1 }); // 如果没有该商品，添加新商品
    }

    localStorage.setItem(key, JSON.stringify(cart)); // 更新购物车数据
    alert("已加入购物车"); // 提示用户已加入购物车
}

// 个人中心跳转
function goUser() {
    const user = localStorage.getItem("currentUser"); // 获取当前用户
    if (!user) {
        alert("请先登录"); // 如果用户未登录，提示登录
        openAuth(); // 打开登录框
        return;
    }
    window.location.href = "user.html"; // 如果已登录，跳转到个人中心
}

// 数量 + 
function increase() {
    const input = document.getElementById("quantity"); // 获取数量输入框
    input.value = parseInt(input.value) + 1; // 数量加1
}

// 数量 - 
function decrease() {
    const input = document.getElementById("quantity"); // 获取数量输入框
    let value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1; // 数量减1，最小为1
    }
}

// 按数量加入购物车
function addToCartWithCount(event, name, price) {
    event.preventDefault(); // 阻止默认行为

    const user = localStorage.getItem("currentUser"); // 获取当前用户
    if (!user) {
        alert("请先登录"); // 如果用户未登录，提示登录
        openAuth(); // 打开登录框
        return;
    }

    const count = parseInt(
        document.getElementById("quantity").value // 获取输入的数量
    );

    const key = "cart_" + user; // 购物车存储的键名
    let cart = JSON.parse(localStorage.getItem(key)) || []; // 获取购物车数据

    const item = cart.find(p => p.name === name); // 查找购物车中是否已有该商品
    if (item) {
        item.count += count; // 如果已有该商品，数量加上用户输入的数量
    } else {
        cart.push({ name, price, count }); // 如果没有该商品，添加新商品
    }

    localStorage.setItem(key, JSON.stringify(cart)); // 更新购物车数据
    alert("已加入购物车 × " + count); // 提示用户加入购物车
}
