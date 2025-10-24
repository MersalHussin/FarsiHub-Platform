# **App Name**: Farsi Hub

## Core Features:

- User Authentication: Implement secure user authentication using Firebase Authentication, including registration, login, and logout functionality. Users are directed to student dashboard after login.
- User Roles and Permissions: Differentiate user roles (student/admin) and manage permissions. Admin users can approve or reject student registration requests.
- Student Dashboard: Provide students with access to available lectures (title, description, PDF link), quizzes, and assignments. Display the student's overall progress.
- Admin Dashboard: Enable admin users to manage lectures (add new lectures with title, description, and PDF link from Google Drive), quizzes (add multiple-choice questions per lecture), and assignments (title, description, due date).
- Lecture Management: Store lectures with title, description, pdfUrl, and createdAt timestamps.
- Quiz and Assignment Management: Manage quizzes and assignments associated with each lecture, including questions, options, correct answers, titles, descriptions, and due dates.
- Submission Tracking: Track student submissions for assignments, including file URLs and submission statuses. Admins can review submissions.

## Style Guidelines:

- Primary color: Green (#2ECC71) to align with the branding, symbolizing growth and learning.
- Background color: Very light grey (#F0F0F0) to provide a clean and neutral backdrop, ensuring readability of the Arabic text.
- Accent color: A slightly darker, more saturated green (#27AE60) to create visual interest and highlight key actions and elements, such as buttons.
- Font: 'Zain Font' (sans-serif) for all text elements. Note: currently only Google Fonts are supported.
- Implement a clean and responsive layout optimized for RTL (right-to-left) languages, ensuring compatibility across all devices.
- Use simple and clear icons to represent different sections and features. These icons must be compatible with RTL layout and modern UI design trends.
- Use subtle animations, such as hover effects and transitions, to improve user engagement without overwhelming the interface.