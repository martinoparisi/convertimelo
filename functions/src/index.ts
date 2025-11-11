import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// HTTP function to get conversion statistics
export const getConversionStats = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const conversionsSnapshot = await db.collection("conversions").get();
    
    const stats = {
      totalConversions: conversionsSnapshot.size,
      byFormat: {} as {[key: string]: number}
    };

    conversionsSnapshot.forEach((doc) => {
      const data = doc.data();
      const format = data.targetFormat;
      if (format) {
        stats.byFormat[format] = (stats.byFormat[format] || 0) + 1;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Failed to get statistics" });
  }
});

// Clean up old conversions (older than 30 days)
export const cleanupOldConversions = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldConversions = await db
      .collection("conversions")
      .where("timestamp", "<", thirtyDaysAgo)
      .get();

    const batch = db.batch();
    oldConversions.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${oldConversions.size} old conversions`);
    return null;
  });

// Currency rate caching function
export const cacheCurrencyRates = functions.https.onRequest(async (req, res) => {
  try {
    const { base, rates } = req.body;
    
    if (!base || !rates) {
      res.status(400).json({ error: "Missing base currency or rates" });
      return;
    }

    const db = admin.firestore();
    await db.collection("currency_cache").doc(base).set({
      rates: rates,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Rates cached successfully" });
  } catch (error) {
    console.error("Error caching rates:", error);
    res.status(500).json({ error: "Failed to cache rates" });
  }
});
