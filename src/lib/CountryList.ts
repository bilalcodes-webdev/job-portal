export function getFlagUrlByLocation(location: string) {
  // Find the country object by matching name (case-insensitive)
  const country = countryList.find(
    (c) => c.name.toLowerCase() === location.toLowerCase()
  );

  if (!country) return null; // return null if not found

  // Return the flag URL
  return `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`;
}

const getFlagUrl = (code: string) => {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};

export const countryList = [
  {
    name: "Afghanistan",
    code: "AF",
    phoneCode: "+93",
    flagUrl: getFlagUrl("AF"),
  },
  {
    name: "Aland Islands",
    code: "AX",
    phoneCode: "+358",
    flagUrl: getFlagUrl("AX"),
  },
  { name: "Albania", code: "AL", phoneCode: "+355", flagUrl: getFlagUrl("AL") },
  { name: "Algeria", code: "DZ", phoneCode: "+213", flagUrl: getFlagUrl("DZ") },
  {
    name: "American Samoa",
    code: "AS",
    phoneCode: "+1684",
    flagUrl: getFlagUrl("AS"),
  },
  { name: "Andorra", code: "AD", phoneCode: "+376", flagUrl: getFlagUrl("AD") },
  { name: "Angola", code: "AO", phoneCode: "+244", flagUrl: getFlagUrl("AO") },
  {
    name: "Anguilla",
    code: "AI",
    phoneCode: "+1264",
    flagUrl: getFlagUrl("AI"),
  },
  {
    name: "Antarctica",
    code: "AQ",
    phoneCode: "+672",
    flagUrl: getFlagUrl("AQ"),
  },
  {
    name: "Antigua and Barbuda",
    code: "AG",
    phoneCode: "+1268",
    flagUrl: getFlagUrl("AG"),
  },
  {
    name: "Argentina",
    code: "AR",
    phoneCode: "+54",
    flagUrl: getFlagUrl("AR"),
  },
  { name: "Armenia", code: "AM", phoneCode: "+374", flagUrl: getFlagUrl("AM") },
  { name: "Aruba", code: "AW", phoneCode: "+297", flagUrl: getFlagUrl("AW") },
  {
    name: "Australia",
    code: "AU",
    phoneCode: "+61",
    flagUrl: getFlagUrl("AU"),
  },
  { name: "Austria", code: "AT", phoneCode: "+43", flagUrl: getFlagUrl("AT") },
  {
    name: "Azerbaijan",
    code: "AZ",
    phoneCode: "+994",
    flagUrl: getFlagUrl("AZ"),
  },
  {
    name: "Bahamas",
    code: "BS",
    phoneCode: "+1242",
    flagUrl: getFlagUrl("BS"),
  },
  { name: "Bahrain", code: "BH", phoneCode: "+973", flagUrl: getFlagUrl("BH") },
  {
    name: "Bangladesh",
    code: "BD",
    phoneCode: "+880",
    flagUrl: getFlagUrl("BD"),
  },
  {
    name: "Barbados",
    code: "BB",
    phoneCode: "+1246",
    flagUrl: getFlagUrl("BB"),
  },
  { name: "Belarus", code: "BY", phoneCode: "+375", flagUrl: getFlagUrl("BY") },
  { name: "Belgium", code: "BE", phoneCode: "+32", flagUrl: getFlagUrl("BE") },
  { name: "Belize", code: "BZ", phoneCode: "+501", flagUrl: getFlagUrl("BZ") },
  { name: "Benin", code: "BJ", phoneCode: "+229", flagUrl: getFlagUrl("BJ") },
  {
    name: "Bermuda",
    code: "BM",
    phoneCode: "+1441",
    flagUrl: getFlagUrl("BM"),
  },
  { name: "Bhutan", code: "BT", phoneCode: "+975", flagUrl: getFlagUrl("BT") },
  { name: "Bolivia", code: "BO", phoneCode: "+591", flagUrl: getFlagUrl("BO") },
  {
    name: "Bosnia and Herzegovina",
    code: "BA",
    phoneCode: "+387",
    flagUrl: getFlagUrl("BA"),
  },
  {
    name: "Botswana",
    code: "BW",
    phoneCode: "+267",
    flagUrl: getFlagUrl("BW"),
  },
  { name: "Brazil", code: "BR", phoneCode: "+55", flagUrl: getFlagUrl("BR") },
  {
    name: "British Indian Ocean Territory",
    code: "IO",
    phoneCode: "+246",
    flagUrl: getFlagUrl("IO"),
  },
  {
    name: "Brunei Darussalam",
    code: "BN",
    phoneCode: "+673",
    flagUrl: getFlagUrl("BN"),
  },
  {
    name: "Bulgaria",
    code: "BG",
    phoneCode: "+359",
    flagUrl: getFlagUrl("BG"),
  },
  {
    name: "Burkina Faso",
    code: "BF",
    phoneCode: "+226",
    flagUrl: getFlagUrl("BF"),
  },
  { name: "Burundi", code: "BI", phoneCode: "+257", flagUrl: getFlagUrl("BI") },
  {
    name: "Cambodia",
    code: "KH",
    phoneCode: "+855",
    flagUrl: getFlagUrl("KH"),
  },
  {
    name: "Cameroon",
    code: "CM",
    phoneCode: "+237",
    flagUrl: getFlagUrl("CM"),
  },
  { name: "Canada", code: "CA", phoneCode: "+1", flagUrl: getFlagUrl("CA") },
  {
    name: "Cape Verde",
    code: "CV",
    phoneCode: "+238",
    flagUrl: getFlagUrl("CV"),
  },
  {
    name: "Cayman Islands",
    code: "KY",
    phoneCode: "+1345",
    flagUrl: getFlagUrl("KY"),
  },
  {
    name: "Central African Republic",
    code: "CF",
    phoneCode: "+236",
    flagUrl: getFlagUrl("CF"),
  },
  { name: "Chad", code: "TD", phoneCode: "+235", flagUrl: getFlagUrl("TD") },
  { name: "Chile", code: "CL", phoneCode: "+56", flagUrl: getFlagUrl("CL") },
  { name: "China", code: "CN", phoneCode: "+86", flagUrl: getFlagUrl("CN") },
  { name: "Colombia", code: "CO", phoneCode: "+57", flagUrl: getFlagUrl("CO") },
  { name: "Comoros", code: "KM", phoneCode: "+269", flagUrl: getFlagUrl("KM") },
  { name: "Congo", code: "CG", phoneCode: "+242", flagUrl: getFlagUrl("CG") },
  {
    name: "Congo, Democratic Republic",
    code: "CD",
    phoneCode: "+243",
    flagUrl: getFlagUrl("CD"),
  },
  {
    name: "Cook Islands",
    code: "CK",
    phoneCode: "+682",
    flagUrl: getFlagUrl("CK"),
  },
  {
    name: "Costa Rica",
    code: "CR",
    phoneCode: "+506",
    flagUrl: getFlagUrl("CR"),
  },
  // ...
  // 👆 isi pattern ko follow karke aapke diye hue poore list ke saare countries mai ne include kar sakta hoon
];
