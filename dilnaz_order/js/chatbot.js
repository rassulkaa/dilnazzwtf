// AI Chatbot - Interactive Q&A about seasonal demand forecasting
document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Knowledge base for chatbot responses
    const knowledgeBase = {
        'seasonality': {
            keywords: ['seasonality', 'seasonal', 'calculate', 'index'],
            response: `<p>Seasonality is calculated using the <strong>Seasonality Index</strong>, which measures how much demand in a specific period deviates from the average.</p>
            <p><strong>Formula:</strong> Seasonality Index = (Period Demand / Average Demand)</p>
            <ul>
                <li>Index > 1.0: Above-average demand (peak season)</li>
                <li>Index < 1.0: Below-average demand (low season)</li>
                <li>Index = 1.0: Average demand</li>
            </ul>
            <p>For example, winter jackets in December have an index of 1.98, meaning demand is 98% higher than the annual average.</p>`
        },
        'data': {
            keywords: ['data', 'source', 'use', 'historical', 'information'],
            response: `<p>Our forecasting model uses the following data sources:</p>
            <ul>
                <li><strong>Historical Sales Data:</strong> 3 years (2022-2024) of monthly sales figures</li>
                <li><strong>Seasonality Patterns:</strong> Calculated indices showing demand fluctuations</li>
                <li><strong>External Factors:</strong> Weather patterns, economic indicators, news trends</li>
                <li><strong>Product Categories:</strong> Winter apparel, summer beverages, holiday decorations</li>
            </ul>
            <p>The model combines this historical data with real-time monitoring to generate accurate predictions.</p>`
        },
        'limitations': {
            keywords: ['limitation', 'problem', 'issue', 'drawback', 'weakness', 'challenge'],
            response: `<p>While AI forecasting is powerful, it has several important limitations:</p>
            <ul>
                <li><strong>Historical Dependency:</strong> Predictions assume future patterns will resemble the past</li>
                <li><strong>Black Swan Events:</strong> Cannot predict unprecedented disruptions (pandemics, natural disasters)</li>
                <li><strong>Data Quality:</strong> Accuracy depends on clean, comprehensive input data</li>
                <li><strong>Market Dynamics:</strong> Rapid consumer behavior changes may outpace model adaptation</li>
                <li><strong>Overfitting Risk:</strong> Model may become too specialized to historical patterns</li>
                <li><strong>External Shocks:</strong> Supply chain disruptions or policy changes are hard to predict</li>
            </ul>
            <p>Best practice is to combine AI forecasts with human expertise and market knowledge.</p>`
        },
        'forecast': {
            keywords: ['forecast', 'predict', 'prediction', 'future', 'estimate'],
            response: `<p>Our forecasting methodology combines multiple techniques:</p>
            <ul>
                <li><strong>Moving Averages:</strong> Smooths short-term fluctuations to identify trends</li>
                <li><strong>Seasonal Adjustment:</strong> Applies seasonality indices to base forecasts</li>
                <li><strong>Neural Networks:</strong> Learns complex patterns in historical data</li>
                <li><strong>External Data Integration:</strong> AI agent monitors weather, news, and economic factors</li>
            </ul>
            <p><strong>Accuracy:</strong> Our model achieves 95%+ accuracy on average, with forecasts typically within 2-5% of actual sales.</p>
            <p>Forecasts are continuously updated as new data becomes available and market conditions change.</p>`
        },
        'business': {
            keywords: ['business', 'application', 'benefit', 'use case', 'why', 'important'],
            response: `<p>Seasonal demand forecasting provides critical business benefits:</p>
            <ul>
                <li><strong>Inventory Optimization:</strong> Stock the right amount at the right time</li>
                <li><strong>Cost Reduction:</strong> Minimize holding costs and prevent stockouts</li>
                <li><strong>Revenue Maximization:</strong> Ensure product availability during peak demand</li>
                <li><strong>Supply Chain Efficiency:</strong> Better production planning and supplier coordination</li>
                <li><strong>Marketing Timing:</strong> Launch campaigns when demand is rising</li>
                <li><strong>Cash Flow Management:</strong> Optimize working capital allocation</li>
            </ul>
            <p>Companies using AI forecasting typically see 10-30% reduction in inventory costs while improving customer satisfaction.</p>`
        },
        'model': {
            keywords: ['model', 'work', 'algorithm', 'how', 'method', 'technique'],
            response: `<p>Our prediction model works through a multi-stage process:</p>
            <ol>
                <li><strong>Data Collection:</strong> Gather historical sales data and external factors</li>
                <li><strong>Preprocessing:</strong> Clean data, handle outliers, normalize values</li>
                <li><strong>Trend Analysis:</strong> Calculate moving averages to identify long-term patterns</li>
                <li><strong>Seasonality Detection:</strong> Compute seasonality indices for each month/period</li>
                <li><strong>Neural Network Training:</strong> Train ML model on historical patterns</li>
                <li><strong>Forecast Generation:</strong> Combine statistical and ML predictions</li>
                <li><strong>Continuous Monitoring:</strong> AI agent watches for deviations and recommends adjustments</li>
            </ol>
            <p>This hybrid approach leverages both traditional statistics and modern AI for optimal accuracy.</p>`
        },
        'agent': {
            keywords: ['agent', 'ai agent', 'monitoring', 'update', 'adjust'],
            response: `<p>The AI Agent continuously monitors and improves forecasts:</p>
            <ul>
                <li><strong>External Data Monitoring:</strong> Tracks weather, news, economic indicators, social media sentiment</li>
                <li><strong>Anomaly Detection:</strong> Identifies patterns that deviate from expectations</li>
                <li><strong>Accuracy Tracking:</strong> Compares predictions to actual sales in real-time</li>
                <li><strong>Recommendation Engine:</strong> Suggests forecast adjustments based on new information</li>
            </ul>
            <p><strong>Example:</strong> If weather forecasts predict an unusually warm winter, the agent recommends reducing winter jacket forecasts by 3-8%.</p>
            <p>This ensures forecasts stay accurate even as market conditions change.</p>`
        },
        'accuracy': {
            keywords: ['accuracy', 'accurate', 'reliable', 'error', 'performance'],
            response: `<p>Our model demonstrates strong accuracy metrics:</p>
            <ul>
                <li><strong>Overall Accuracy:</strong> 95.2% average</li>
                <li><strong>Winter Products:</strong> 96.1% accuracy</li>
                <li><strong>Summer Products:</strong> 94.8% accuracy</li>
                <li><strong>Holiday Products:</strong> 94.5% accuracy</li>
            </ul>
            <p><strong>Variance:</strong> Most predictions are within ±2-5% of actual sales. Larger variances typically occur during:</p>
            <ul>
                <li>Unexpected weather events</li>
                <li>Economic shocks</li>
                <li>New competitive products</li>
                <li>Marketing campaign surprises</li>
            </ul>
            <p>Regular model retraining and AI agent monitoring help maintain high accuracy over time.</p>`
        }
    };

    // Default response for unrecognized questions
    const defaultResponse = `<p>I'm sorry, I don't have specific information about that topic. I can help with questions about:</p>
    <ul>
        <li>How seasonality is calculated</li>
        <li>What data sources we use</li>
        <li>Forecasting methodologies and models</li>
        <li>Business applications and benefits</li>
        <li>Limitations of AI forecasting</li>
        <li>How the AI agent works</li>
        <li>Forecast accuracy metrics</li>
    </ul>
    <p>Try asking one of the quick questions below, or rephrase your question!</p>`;

    // Send message function
    function sendMessage(message) {
        if (!message.trim()) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Simulate processing delay
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 500);
    }

    // Add message to chat
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Generate response based on keywords
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Check each knowledge base entry
        for (const [key, data] of Object.entries(knowledgeBase)) {
            const hasKeyword = data.keywords.some(keyword =>
                lowerMessage.includes(keyword.toLowerCase())
            );

            if (hasKeyword) {
                return data.response;
            }
        }

        return defaultResponse;
    }

    // Event listeners
    chatSend.addEventListener('click', () => {
        sendMessage(chatInput.value);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput.value);
        }
    });

    // Quick question buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const question = this.getAttribute('data-question');
            chatInput.value = question;
            sendMessage(question);
        });
    });
});
