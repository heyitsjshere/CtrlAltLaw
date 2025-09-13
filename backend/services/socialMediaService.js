class SocialMediaService {
    constructor() {
        // Singapore government social media accounts
        this.officialAccounts = {
            twitter: {
                '@GovSingapore': 'Official Singapore Government',
                '@MCI_Sg': 'Ministry of Communications and Information',
                '@MOHSingapore': 'Ministry of Health',
                '@MOMSingapore': 'Ministry of Manpower',
                '@SGPrimeMinist': 'Prime Minister Office',
                '@MNDSingapore': 'Ministry of National Development',
                '@MOESingapore': 'Ministry of Education',
                '@LTAsg': 'Land Transport Authority',
                '@NEAsg': 'National Environment Agency'
            },
            facebook: {
                'GovSingapore': 'Official Singapore Government',
                'MCI.sg': 'Ministry of Communications and Information',
                'MOHSingapore': 'Ministry of Health'
            }
        };
    }

    async searchSocialMediaPosts(query, queryAnalysis) {
        console.log('Searching social media for:', query);

        const socialPosts = [];

        try {
            // In a real implementation, these would be actual API calls
            // For hackathon demo, we'll generate realistic mock data

            const twitterPosts = await this.generateMockTwitterPosts(query, queryAnalysis);
            const facebookPosts = await this.generateMockFacebookPosts(query, queryAnalysis);

            socialPosts.push(...twitterPosts, ...facebookPosts);

            return this.processSocialMediaResults(socialPosts, query);

        } catch (error) {
            console.error('Social media search error:', error);
            return [];
        }
    }

    async generateMockTwitterPosts(query, queryAnalysis) {
        const posts = [];

        // Generate relevant posts based on query entities
        const relevantAccounts = this.getRelevantAccounts(queryAnalysis);

        relevantAccounts.forEach(account => {
            posts.push({
                platform: 'twitter',
                account: account.handle,
                account_name: account.name,
                post_id: `tweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                content: this.generateRelevantContent(query, account, 'twitter'),
                timestamp: this.generateRecentTimestamp(),
                url: `https://twitter.com/${account.handle.replace('@', '')}/status/1234567890`,
                engagement: {
                    likes: Math.floor(Math.random() * 500) + 50,
                    retweets: Math.floor(Math.random() * 200) + 20,
                    replies: Math.floor(Math.random() * 100) + 10
                },
                verified: true,
                post_type: 'original'
            });
        });

        return posts;
    }

    async generateMockFacebookPosts(query, queryAnalysis) {
        const posts = [];

        // Generate Facebook posts from official pages
        Object.entries(this.officialAccounts.facebook).forEach(([handle, name]) => {
            posts.push({
                platform: 'facebook',
                account: handle,
                account_name: name,
                post_id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                content: this.generateRelevantContent(query, { handle, name }, 'facebook'),
                timestamp: this.generateRecentTimestamp(),
                url: `https://www.facebook.com/${handle}/posts/1234567890`,
                engagement: {
                    likes: Math.floor(Math.random() * 1000) + 100,
                    shares: Math.floor(Math.random() * 300) + 30,
                    comments: Math.floor(Math.random() * 150) + 15
                },
                verified: true,
                post_type: 'original'
            });
        });

        return posts.slice(0, 2); // Limit for demo
    }

    getRelevantAccounts(queryAnalysis) {
        const accounts = [];
        const entities = queryAnalysis.entities;

        // Map query entities to relevant social media accounts
        if (entities.organizations.includes('BTO') || entities.policies.includes('housing')) {
            accounts.push({ handle: '@MNDSingapore', name: 'Ministry of National Development' });
        }

        if (entities.organizations.includes('CPF')) {
            accounts.push({ handle: '@MOMSingapore', name: 'Ministry of Manpower' });
        }

        if (entities.organizations.includes('ERP') || entities.policies.includes('transport')) {
            accounts.push({ handle: '@LTAsg', name: 'Land Transport Authority' });
        }

        if (entities.ministers.length > 0) {
            accounts.push({ handle: '@SGPrimeMinist', name: 'Prime Minister Office' });
        }

        // Default to main government account if no specific matches
        if (accounts.length === 0) {
            accounts.push({ handle: '@GovSingapore', name: 'Official Singapore Government' });
        }

        return accounts;
    }

    generateRelevantContent(query, account, platform) {
        const templates = {
            housing: [
                `Update on BTO applications: We're working to reduce waiting times and increase housing supply. More details in our latest policy briefing.`,
                `New measures announced to address housing affordability. Public consultation starts next month.`,
                `Progress update: BTO completion rates have improved by 15% this quarter.`
            ],
            transport: [
                `ERP rates adjusted to optimize traffic flow during peak hours. Changes effective from next Monday.`,
                `New MRT line construction on schedule. Expected completion by 2025.`,
                `Traffic advisory: Road works on major highways this weekend.`
            ],
            general: [
                `Government announces new initiatives to support Singapore families.`,
                `Policy updates and public consultation opportunities available on our website.`,
                `Singapore continues to strengthen its position as a regional hub.`
            ]
        };

        let contentType = 'general';
        const queryLower = query.toLowerCase();

        if (queryLower.includes('bto') || queryLower.includes('housing')) contentType = 'housing';
        else if (queryLower.includes('erp') || queryLower.includes('transport')) contentType = 'transport';

        const options = templates[contentType];
        const baseContent = options[Math.floor(Math.random() * options.length)];

        // Add platform-specific formatting
        if (platform === 'twitter') {
            return `${baseContent} #Singapore #PublicPolicy`;
        } else {
            return `${baseContent}\n\nFor more information, visit our website or contact our customer service.`;
        }
    }

    generateRecentTimestamp() {
        // Generate timestamp within last 30 days
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);

        const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
        return timestamp.toISOString();
    }

    processSocialMediaResults(posts, query) {
        return posts.map(post => ({
            title: `${post.account_name} - ${post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} Post`,
            content: post.content,
            source: `${post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} - ${post.account_name}`,
            url: post.url,
            date: post.timestamp.split('T')[0],
            speaker: post.account_name,
            type: 'social_media',
            reliability: this.calculateSocialMediaReliability(post),
            platform: post.platform,
            engagement: post.engagement,
            verified: post.verified,
            socialMediaMetadata: {
                post_id: post.post_id,
                account_handle: post.account,
                engagement_score: this.calculateEngagementScore(post.engagement),
                post_type: post.post_type
            }
        }));
    }

    calculateSocialMediaReliability(post) {
        if (!post.verified) return 'LOW';

        // Official government accounts get high reliability
        const isOfficialGovAccount =
            Object.values(this.officialAccounts.twitter).includes(post.account_name) ||
            Object.values(this.officialAccounts.facebook).includes(post.account_name);

        if (isOfficialGovAccount) return 'HIGH';

        // Base reliability on engagement and verification
        const engagementScore = this.calculateEngagementScore(post.engagement);
        if (engagementScore > 100) return 'MEDIUM';

        return 'LOW';
    }

    calculateEngagementScore(engagement) {
        // Simple engagement calculation
        if (engagement.likes && engagement.retweets) {
            return engagement.likes + (engagement.retweets * 2) + (engagement.replies || 0);
        } else if (engagement.likes && engagement.shares) {
            return engagement.likes + (engagement.shares * 2) + (engagement.comments || 0);
        }
        return 0;
    }

    crossReferenceWithOfficialSources(socialPosts, officialDocuments) {
        const crossReferences = [];

        socialPosts.forEach(socialPost => {
            officialDocuments.forEach(officialDoc => {
                const similarity = this.calculateContentSimilarity(socialPost.content, officialDoc.content);

                if (similarity > 30) { // 30% similarity threshold
                    crossReferences.push({
                        social_post: {
                            platform: socialPost.platform,
                            account: socialPost.speaker,
                            content_preview: socialPost.content.substring(0, 100) + '...',
                            date: socialPost.date,
                            url: socialPost.url
                        },
                        official_document: {
                            source: officialDoc.source,
                            content_preview: officialDoc.content.substring(0, 100) + '...',
                            date: officialDoc.date,
                            url: officialDoc.url
                        },
                        similarity_score: similarity,
                        relationship_type: similarity > 70 ? 'likely_same_announcement' : 'related_content',
                        analysis: `Social media post ${similarity > 70 ? 'appears to announce the same information' : 'relates to'} official document content`
                    });
                }
            });
        });

        return crossReferences;
    }

    calculateContentSimilarity(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(' '));
        const words2 = new Set(text2.toLowerCase().split(' '));

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return Math.round((intersection.size / union.size) * 100);
    }
}

module.exports = new SocialMediaService();