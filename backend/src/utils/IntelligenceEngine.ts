export class IntelligenceEngine {
  /**
   * Normalize data values from CSV
   */
  static normalize(data: Record<string, any>, type: string): Record<string, any> {
    const normalized: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      let val = value;

      // 1. Trim strings
      if (typeof val === 'string') {
        val = val.trim();
      }

      // 2. Normalize Revenue (e.g. "₹199 Cr" -> 199)
      if (key.toLowerCase().includes('revenue') && typeof val === 'string') {
        const match = val.match(/(\d+(\.\d+)?)/);
        if (match) val = parseFloat(match[0]);
      }

      // 3. Normalize Yes/No fields
      if (typeof val === 'string' && (val.toLowerCase() === 'yes' || val.toLowerCase() === 'y')) {
        val = true;
      } else if (typeof val === 'string' && (val.toLowerCase() === 'no' || val.toLowerCase() === 'n')) {
        val = false;
      }

      // 4. Normalize Influencer Platforms
      if (key.toLowerCase().includes('platform') && typeof val === 'string') {
        val = val.split(/[+,/&]/).map(p => p.trim()).filter(p => p !== '');
      }

      // 5. Normalize Employee Count
      if (key.toLowerCase().includes('employee') && typeof val === 'string') {
        // Just keeping it as string or range, but could parse min/max
      }

      normalized[key] = val;
    });

    return normalized;
  }

  /**
   * Generate opportunity tags based on logic
   */
  static generateTags(data: Record<string, any>, type: string): string[] {
    const tags: string[] = [];

    if (type === 'BRAND') {
      const revenue = parseFloat(data.revenue) || 0;
      const influencerUsage = !!data.influencer_usage;
      const funding = !!data.funding_amount;
      const outreach = !!data.influencer_marketing_outreach;

      // High Opportunity: High influencer usage + no outreach done
      if (influencerUsage && !outreach) {
        tags.push("High Opportunity");
      }

      // Untapped Opportunity: Strong revenue + no influencer usage
      if (revenue > 50 && !influencerUsage) {
        tags.push("Untapped Opportunity");
      }

      // Scaling Fast: Recent funding or high revenue growth
      if (funding || revenue > 100) {
        tags.push("Scaling Fast");
      }

      // Enterprise Ready
      if (revenue > 500) {
        tags.push("Enterprise Ready");
      }

      // D2C Heavy
      if (data.category?.toLowerCase().includes('d2c') || data.brand_focus?.toLowerCase().includes('d2c')) {
        tags.push("D2C Heavy");
      }
    }

    if (type === 'INFLUENCER') {
      const subs = parseInt(data.subscribers) || 0;
      const views = parseInt(data.total_views) || 0;

      if (subs > 1000000) tags.push("Mega Influencer");
      else if (subs > 100000) tags.push("Macro Influencer");
      else if (subs > 10000) tags.push("Micro Influencer");

      if (views > 10000000) tags.push("Viral Potential");
      if (data.has_email && data.has_phone) tags.push("Highly Contactable");
    }

    return tags;
  }
}
