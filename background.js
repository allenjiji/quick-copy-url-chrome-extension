// Handle keyboard shortcut command
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'copy-url') {
        try {
            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab?.url) return;

            // For regular pages, proceed with copy and toast
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (url) => {
                    // Copy URL to clipboard
                    navigator.clipboard.writeText(url).then(() => {
                        // Create and show toast
                        const toast = document.createElement('div');
                        toast.textContent = 'URL copied to clipboard!';

                        // Style the toast
                        Object.assign(toast.style, {
                            position: 'fixed',
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: '999999',
                            opacity: '0',
                            transform: 'translateY(-20px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease'
                        });

                        // Add toast to the page
                        document.body.appendChild(toast);

                        // Trigger animation
                        requestAnimationFrame(() => {
                            toast.style.opacity = '1';
                            toast.style.transform = 'translateY(0)';
                        });

                        // Remove toast after 3 seconds
                        setTimeout(() => {
                            toast.style.opacity = '0';
                            toast.style.transform = 'translateY(-20px)';
                            setTimeout(() => toast.remove(), 300);
                        }, 3000);
                    });
                },
                args: [tab.url]
            });
        } catch (error) {
            console.log('Failed to copy URL:', error);
        }
    }
});