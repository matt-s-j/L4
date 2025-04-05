<svelte:head>
    <title>Contact Me</title>
</svelte:head>
<body>
    <h1>Contact Information</h1>
    <p>
        You can reach me at:
        <br>
        Email:
        <br>
        Phone:
        <br>
        LinkedIn:
        <br>
        GitHub:
        <br>
    </p> 
    <form action="mailto:foo@bar.com" method="get">
        <label for="email">Email: <input type="email" name="email" placeholder="Your Email" required> </label>
        <label for="subject">Subject: <input type="subject" name="subject" placeholder="Subject" required> </label>
        <label for="body">Message: <textarea name="body" rows="5" placeholder="Your Message" required></textarea> </label>
        <input type="submit" value="Submit">
    </form>
</body>