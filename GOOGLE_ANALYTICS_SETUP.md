# Google Analytics 4 Setup Guide

## Đã được tích hợp:
✅ Google Analytics 4 script
✅ E-commerce tracking
✅ Custom events tracking
✅ Privacy-compliant configuration

## Cách setup:

### 1. Tạo Google Analytics Account
1. Đi tới https://analytics.google.com
2. Tạo account mới hoặc đăng nhập
3. Tạo property mới cho website
4. Chọn "Web" platform
5. Nhập thông tin website

### 2. Lấy Measurement ID
1. Trong GA4 property, đi tới Admin
2. Chọn "Data Streams"
3. Click vào web stream
4. Copy Measurement ID (format: G-XXXXXXXXXX)

### 3. Configure trong project
1. Tạo file `.env.local` trong starbucks-nextjs folder
2. Thêm dòng sau:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_ACTUAL_ID_HERE
```

### 4. Restart development server
```bash
cd starbucks-nextjs
npm run dev
```

## Events được tracking:

### Automatic Events:
- Page views
- Scroll tracking
- File downloads
- External link clicks

### Custom Events:
- **Product View**: Khi user xem product detail
- **Add to Cart**: Khi user thêm sản phẩm vào consultation cart
- **Search**: Khi user search sản phẩm
- **Purchase**: Khi user submit consultation form (conversion)
- **Category Filter**: Khi user filter theo category
- **Pagination**: Khi user chuyển page
- **Mobile Menu**: Khi user mở/đóng mobile menu
- **Cart Actions**: Khi user mở/đóng cart

### E-commerce Tracking:
- Consultation submissions được track như "purchase" events
- Product details được gửi với mỗi event
- Value estimation cho conversion tracking

## Kiểm tra hoạt động:

### 1. Real-time Reports
1. Mở GA4 dashboard
2. Đi tới Reports > Real-time
3. Browse website và xem events xuất hiện

### 2. Debug Events
1. Mở Developer Tools (F12)
2. Vào Console tab
3. Type: `gtag('config', 'GA_MEASUREMENT_ID', { debug_mode: true })`
4. Events sẽ hiển thị trong console

### 3. GA4 DebugView
1. Cài GA4 DebugView Chrome extension
2. Enable debug mode
3. Browse website và xem detailed events

## Privacy & Compliance:

### Đã configure:
- IP anonymization
- No Google Signals
- Secure cookies
- No PII collection

### GDPR Compliance:
- Consider adding cookie consent banner
- Provide opt-out mechanism
- Update privacy policy

## Metrics quan trọng:

### Traffic:
- Page views
- Unique visitors
- Session duration
- Bounce rate

### E-commerce:
- Consultation conversions
- Product interest
- Cart abandonment
- Popular products

### User Behavior:
- Search terms
- Navigation patterns
- Mobile vs desktop
- Geographic data

## Troubleshooting:

### Events không xuất hiện:
1. Kiểm tra Measurement ID đúng chưa
2. Kiểm tra .env.local file
3. Restart development server
4. Check browser console cho errors

### Development vs Production:
- Events sẽ xuất hiện trong both environments
- Production data sẽ chính xác hơn
- Consider using separate GA4 properties cho dev/prod

## Performance Impact:
- **Script size**: ~45KB (compressed, cached)
- **Loading**: Async, non-blocking
- **Runtime**: Minimal background processing
- **Page speed**: Không ảnh hưởng đáng kể

Google Analytics 4 integration đã sẵn sàng! Chỉ cần thêm Measurement ID là có thể bắt đầu tracking.