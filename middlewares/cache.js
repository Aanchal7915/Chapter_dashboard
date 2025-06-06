const res = require('express/lib/response');
const redis = require('redis');
const client = redis.createClient();
client.connect();

module.exports = async (req, res, next) => {
  try {
    const key = `chapters:${JSON.stringify(req.query)}`;
    const cached = await client.get(key);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
    res.sendResponse = res.json;
    res.json = async (body) => {
      await client.setEx(key, 3600, JSON.stringify(body));
      res.sendResponse(body);
    };
    next();
  }
  catch (error) {
    console.error('Cache middleware error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports.invalidateCache = async () => {
  try{
  const keys = await client.keys("chapters*");
  for (let key of keys) await client.del(key);
  }catch(e){
    res.status(500).json({ message: 'Internal Server Error' });
    console.error('Error invalidating cache:', e);
  }
};
