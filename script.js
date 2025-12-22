// 轮播图配置
const carouselConfig = {
    // Unsplash随机图片API，可配置不同主题
    imageThemes: ['pinduoduo', 'shopping', 'ecommerce', 'promotion', 'sale'],
    // 轮播图片数量
    imageCount: 3,
    // 自动轮播间隔（毫秒）
    interval: 3000,
    // 随机模式：true表示每次加载随机图片，false表示固定图片列表
    randomMode: true
};

// 轮播图类
class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.slides = [];
        this.indicators = [];
        this.currentIndex = 0;
        this.intervalId = null;
        this.config = carouselConfig;

        this.init();
    }

    // 初始化轮播图
    init() {
        this.createSlides();
        this.createNavigation();
        this.createIndicators();
        this.startAutoPlay();
        this.bindEvents();
    }

    // 创建轮播图片
    createSlides() {
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'banner-container';

        for (let i = 0; i < this.config.imageCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'banner-slide';

            const img = document.createElement('img');
            img.src = `./img/${i}.webp`;
            img.alt = `轮播图 ${i + 1}`;

            slide.appendChild(img);
            slidesContainer.appendChild(slide);
            this.slides.push(slide);
        }

        this.container.appendChild(slidesContainer);
        this.showSlide(0);
    }

    // 获取随机图片URL
    getRandomImageUrl() {
        if (this.config.randomMode) {
            const randomTheme = this.config.imageThemes[Math.floor(Math.random() * this.config.imageThemes.length)];
            // 使用Unsplash随机图片API
            return `https://source.unsplash.com/random/1200x400/?${randomTheme}`;
        } else {
            // 固定图片列表（如果需要）
            const fixedImages = [
                'https://cdn.pinduoduo.com/upload/2020-12-14/7531b9a5-e242-4124-89df-254df0862ab5.jpg',
                'https://cdn.pinduoduo.com/upload/2021-01-15/1a2b3c4d5e6f.jpg',
                'https://cdn.pinduoduo.com/upload/2021-02-20/9a8b7c6d5e4f.jpg',
                'https://cdn.pinduoduo.com/upload/2021-03-10/5a4b3c2d1e0f.jpg',
                'https://cdn.pinduoduo.com/upload/2021-04-05/10a9b8c7d6e5f.jpg'
            ];
            return fixedImages[Math.floor(Math.random() * fixedImages.length)];
        }
    }

    // 创建导航按钮
    createNavigation() {
        const navContainer = document.createElement('div');
        navContainer.className = 'banner-nav';

        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '‹';
        prevBtn.addEventListener('click', () => this.prevSlide());

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '›';
        nextBtn.addEventListener('click', () => this.nextSlide());

        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);
        this.container.appendChild(navContainer);
    }

    // 创建指示器
    createIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'banner-indicators';

        for (let i = 0; i < this.config.imageCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.showSlide(i));
            indicatorsContainer.appendChild(indicator);
            this.indicators.push(indicator);
        }

        this.container.appendChild(indicatorsContainer);
        this.updateIndicators(0);
    }

    // 显示指定索引的轮播图
    showSlide(index) {
        // 隐藏当前轮播图
        this.slides[this.currentIndex].classList.remove('active');

        // 更新当前索引
        this.currentIndex = index;

        // 显示新的轮播图
        this.slides[this.currentIndex].classList.add('active');

        // 更新指示器
        this.updateIndicators(index);
    }

    // 更新指示器状态
    updateIndicators(activeIndex) {
        this.indicators.forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // 上一张
    prevSlide() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) {
            newIndex = this.slides.length - 1;
        }
        this.showSlide(newIndex);
    }

    // 下一张
    nextSlide() {
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.slides.length) {
            newIndex = 0;
        }
        this.showSlide(newIndex);
    }

    // 开始自动播放
    startAutoPlay() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.config.interval);
    }

    // 停止自动播放
    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // 绑定事件
    bindEvents() {
        // 鼠标悬停停止自动播放
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        // 鼠标离开恢复自动播放
        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    // 重新加载随机图片
    reloadRandomImages() {
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            img.src = this.getRandomImageUrl();
        });
    }
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    // 确保轮播图容器存在
    if (document.getElementById('banner')) {
        window.carousel = new Carousel('banner');
    }
});

// 打开登录注册框
function openAuth() {
    document.getElementById("authBox").style.display = "flex";
    document.getElementById("authMsg").innerText = "";
}

// 关闭弹窗
function closeAuth() {
    document.getElementById("authBox").style.display = "none";
}
// 退出登录
function logOut() {
    document.querySelector(".nav ul li:nth-child(2) a").innerText = "注册 / 登录";
    localStorage.setItem("currentUser", "");
    closeAuth();
    // 提示用户退出登录
    alert("您已退出登录");
}

// 注册
function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        document.getElementById("authMsg").innerText = "用户名或密码不能为空";
        return;
    }

    if (localStorage.getItem("user_" + username)) {
        document.getElementById("authMsg").innerText = "用户名已存在";
        return;
    }

    localStorage.setItem("user_" + username, password);
    document.getElementById("authMsg").innerText = "注册成功，请登录";
}

// 登录
function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const savedPwd = localStorage.getItem("user_" + username);

    if (!savedPwd) {
        document.getElementById("authMsg").innerText = "用户不存在";
        return;
    }

    if (savedPwd !== password) {
        document.getElementById("authMsg").innerText = "密码错误";
        return;
    }

    localStorage.setItem("currentUser", username);
    alert("登录成功，欢迎你：" + username);
    closeAuth();
    updateUserStatus();
}

// 更新导航栏显示
function updateUserStatus() {
    const user = localStorage.getItem("currentUser");
    if (user) {
        document.querySelector(".nav ul li:nth-child(2) a").innerText = "欢迎，" + user;
    }
}

// 页面加载时检查登录状态
document.addEventListener("DOMContentLoaded", updateUserStatus);


function goCart() {
    const user = localStorage.getItem("currentUser");
    if (!user) {
        alert("请先登录");
        openAuth();
        return;
    }
    window.location.href = "cart.html";
}

function addToCart(event, name, price) {
    event.preventDefault(); // 阻止跳转

    const user = localStorage.getItem("currentUser");
    if (!user) {
        alert("请先登录");
        openAuth();
        return;
    }

    const key = "cart_" + user;
    let cart = JSON.parse(localStorage.getItem(key)) || [];

    const item = cart.find(p => p.name === name);
    if (item) {
        item.count++;
    } else {
        cart.push({ name, price, count: 1 });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    alert("已加入购物车");
}

function goUser() {
    const user = localStorage.getItem("currentUser");
    if (!user) {
        alert("请先登录");
        openAuth();
        return;
    }
    window.location.href = "user.html";
}
// 数量 +
function increase() {
    const input = document.getElementById("quantity");
    input.value = parseInt(input.value) + 1;
}

// 数量 -
function decrease() {
    const input = document.getElementById("quantity");
    let value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1;
    }
}

// 按数量加入购物车
function addToCartWithCount(event, name, price) {
    event.preventDefault();

    const user = localStorage.getItem("currentUser");
    if (!user) {
        alert("请先登录");
        openAuth();
        return;
    }

    const count = parseInt(
        document.getElementById("quantity").value
    );

    const key = "cart_" + user;
    let cart = JSON.parse(localStorage.getItem(key)) || [];

    const item = cart.find(p => p.name === name);
    if (item) {
        item.count += count;
    } else {
        cart.push({ name, price, count });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    alert("已加入购物车 × " + count);
}

