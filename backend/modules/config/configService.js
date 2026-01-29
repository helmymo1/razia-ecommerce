const db = require('../../config/db');

// Initialize Table
const initConfigService = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS store_config (
      id INT AUTO_INCREMENT PRIMARY KEY,
      config_key VARCHAR(100) NOT NULL UNIQUE,
      config_value JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  try {
    await db.query(query);
    console.log("⚙️ Config: Table initialized.");
    
    // Seed default values if not exists
    const [existing] = await db.query("SELECT * FROM store_config WHERE config_key = ?", ['outfit_builder_discounts']);
    if (existing.length === 0) {
      const defaultRules = {
        tier_2: 15,
        tier_3: 20,
        tier_4: 25,
        tier_5: 30 // or whatever default 4+ was
      };
      await setConfig('outfit_builder_discounts', defaultRules);
      console.log("⚙️ Config: Default outfit rules seeded.");
    }

  } catch (err) {
    console.error("Config Init Error:", err);
  }
};

// Get Config
const getConfig = async (key) => {
  try {
    const [rows] = await db.query('SELECT config_value FROM store_config WHERE config_key = ?', [key]);
    if (rows.length > 0) {
      // config_value is JSON type in MySQL 5.7+ or Text. 
      // If table defines it as JSON, mysql2 driver might auto-parse it, or return string.
      // Let's assume it might need parsing if it comes back as string.
      let val = rows[0].config_value;
      if (typeof val === 'string') {
        try { val = JSON.parse(val); } catch(e) {}
      }
      return val;
    }
    return null;
  } catch (err) {
    console.error(`Get Config Error (${key}):`, err);
    throw err;
  }
};

// Set Config
const setConfig = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    const sql = `
      INSERT INTO store_config (config_key, config_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)
    `;
    await db.query(sql, [key, jsonValue]);
    return value;
  } catch (err) {
    console.error(`Set Config Error (${key}):`, err);
    throw err;
  }
};

module.exports = {
  initConfigService,
  getConfig,
  setConfig
};
