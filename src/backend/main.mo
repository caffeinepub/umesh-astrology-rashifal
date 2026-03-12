import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Rashifal record type
  type Rashifal = {
    date : Text;
    rashi : Text;
    prediction : Text;
  };

  // Rashifal storage as persistent map
  let rashifalEntries = Map.empty<Text, Rashifal>();

  // Allowed rashis as persistent set
  let allowedRashis = Set.fromArray(["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"]);

  // Seed data for 13/03/2026
  func seedData() {
    let predictions = [
      ("मेष", "आज का दिन आपके लिए नई उपलब्धियाँ लेकर आएगा। कार्य में सफलता मिलने की संभावना है।"),
      ("वृषभ", "व्यापारिक मामलों में फायदा हो सकता है। परिवार में खुशियों का माहौल रहेगा।"),
      ("मिथुन", "स्वास्थ्य थोडा कमज़ोर रह सकता है, ध्यान रखें। धन लाभ के योग बन रहे हैं।"),
      ("कर्क", "नौकरी में पदोन्नति का संकेत मिल सकता है। शेयर बाजार में निवेश से लाभ।"),
      ("सिंह", "मन में सकारात्मक ऊर्जा का संचार रहेगा। जीवनसाथी से सहयोग मिलेगा।"),
      ("कन्या", "आज का दिन यात्रा के लिए शुभ है। मित्रों से मिल सकते हैं।"),
      ("तुला", "संतान की उन्नति से मन प्रसन्न होगा। शिक्षा के क्षेत्र में सफलता मिलेगी।"),
      ("वृश्चिक", "कोर्ट-कचहरी के मामलों में विजय संभव है। व्यवसाय में बढ़ौतरी होगी।"),
      ("धनु", "स्वास्थ्य पर ध्यान दें। खर्चों पर नियंत्रण रखें।"),
      ("मकर", "पारिवारिक जीवन सुखमय रहेगा। नई चीजों में निवेश लाभदायक रहेगा।"),
      ("कुम्भ", "विदेश यात्रा के योग बन रहे हैं। संतान पक्ष से शुभ समाचार मिलेगा।"),
      ("मीन", "शत्रु परास्त होंगे। धार्मिक कार्यों में रुचि बढ़ेगी।"),
    ];

    for ((rashi, prediction) in predictions.values()) {
      let rashifal = {
        date = "13/03/2026";
        rashi;
        prediction;
      };
      rashifalEntries.add(rashi # "13/03/2026", rashifal);
    };
  };

  // Initialize seed data if not already present
  func initializeIfEmpty() {
    if (rashifalEntries.size() == 0) {
      seedData();
    };
  };

  // Run initialization at canister creation (persistent actors)
  initializeIfEmpty();

  // Create or update a rashifal entry; admin only
  public shared ({ caller }) func createOrUpdateRashifal(date : Text, rashi : Text, prediction : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin users can create or update rashifal entries");
    };

    if (not allowedRashis.contains(rashi)) {
      Runtime.trap("Invalid Rashi: Allowed values - मेष, वृषभ, मिथुन, कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु, मकर, कुम्भ, मीन");
    };

    let rashifal = {
      date;
      rashi;
      prediction;
    };

    rashifalEntries.add(rashi # date, rashifal);
  };

  // Get all rashifals for a given date (public read access)
  public query func getRashifalByDate(date : Text) : async [Rashifal] {
    let matches = rashifalEntries.values().filter(
      func(entry) {
        entry.date == date;
      }
    );
    matches.toArray();
  };

  // Get all available dates (public read access)
  public query func getAllDates() : async [Text] {
    let map = Map.empty<Text, Bool>();

    for (entry in rashifalEntries.values()) {
      map.add(entry.date, true);
    };

    map.keys().toArray();
  };

  // Get all rashifal entries - admin only for debugging/validation
  public query ({ caller }) func getAllEntries() : async [Rashifal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all entries");
    };
    rashifalEntries.values().toArray();
  };
};
