import type { CarInfo } from "./validations";

export interface InsuranceOffer {
  company: string;
  policyType: string;
  premiumRate: number;
  annualPremium: number;
  features: {
    en: string[];
    ar: string[];
  };
  conditions: {
    en: string[];
    ar: string[];
  };
  logo: string;
  deductible: string;
  companyColor: string;
  planType?: string;
  optionId?: string;
}

// Electric vehicle brands with official dealership in Egypt
const ELECTRIC_BRANDS_WITH_DEALERSHIP = [
  "HUMMER",
  "BMW",
  "AUDI",
  "PORCHSEE MACAN",
  "MERCEDES",
  "VOLEX WAGEN",
  "BYD",
  "ROX",
  "HYUNDAI",
  "VOLVO",
  "KIA",
  "NISSAN QUSHQAI",
  "SMART",
  "ZEEKER",
  "XPENG",
];

export function calculateInsuranceOffers(carInfo: CarInfo): InsuranceOffer[] {
  const offers: InsuranceOffer[] = [];
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - carInfo.year;

  // Calculate offers for each company
  const madaOffers = calculateMadaOffers(carInfo, carAge);
  const gigOffers = calculateGIGOffers(carInfo);
  const wethaqOffers = calculateWethaqOffers(carInfo, carAge);

  // Only add companies that have valid offers
  if (madaOffers.length > 0) offers.push(...madaOffers);
  if (gigOffers.length > 0) offers.push(...gigOffers);
  if (wethaqOffers.length > 0) offers.push(...wethaqOffers);

  return offers.sort((a, b) => a.annualPremium - b.annualPremium);
}

function calculateMadaOffers(
  carInfo: CarInfo,
  carAge: number
): InsuranceOffer[] {
  const { make, market_price, fuel_type } = carInfo;
  const offers: InsuranceOffer[] = [];

  // MADA eligibility: Only gasoline cars, max 4 years old (less than 5)
  if (fuel_type === "electric" || carAge >= 5) {
    return [];
  }

  const chineseBrands = [
    "Cherry",
    "Geely",
    "BAIC",
    "Jetour",
    "Haval",
    "JAC",
    "GAC",
    "BYD",
  ];
  const isChineseBrand = chineseBrands.includes(make);

  if (isChineseBrand) {
    return calculateMadaChineseBrands(carInfo);
  } else {
    return calculateMadaRegularBrands(carInfo);
  }
}

function calculateMadaChineseBrands(carInfo: CarInfo): InsuranceOffer[] {
  const { make, market_price } = carInfo;
  const offers: InsuranceOffer[] = [];

  if (["Cherry", "Geely"].includes(make)) {
    // Cherry & Geely - 751,000 to 1,000,000: 2.25%
    if (market_price >= 751000 && market_price <= 1000000) {
      offers.push(
        createMadaOffer(
          0.0225,
          "",
          "500 جنيه عن الحادث",
          "cherry-geely-751k-1m",
          carInfo,
          [
            "اعفاء شرط الإصلاح في التوكيل اول 3 سنوات متضمنه سنة الموديل",
            "يتحمل المؤمن له مبلغ 500 جنيه عن الحادث",
          ]
        )
      );
    }
    // Over 1,000,000: 2.00%
    if (market_price > 1000000) {
      offers.push(
        createMadaOffer(
          0.02,
          "",
          "500 جنيه عن الحادث",
          "cherry-geely-over-1m",
          carInfo,
          [
            "اعفاء شرط الإصلاح في التوكيل اول 3 سنوات متضمنه سنة الموديل",
            "يتحمل المؤمن له مبلغ 500 جنيه عن الحادث",
          ]
        )
      );
    }
  }

  if (["BAIC", "Jetour"].includes(make)) {
    // BAIC & Jetour - 751,000 to Over 1,000,000: 2.00%
    if (market_price >= 751000) {
      offers.push(
        createMadaOffer(
          0.02,
          "",
          "500 جنيه عن الحادث",
          "baic-jetour-751k-over",
          carInfo,
          [
            "اعفاء شرط الإصلاح في التوكيل اول 3 سنوات متضمنه سنة الموديل",
            "يتحمل المؤمن له مبلغ 500 جنيه عن الحادث",
          ]
        )
      );
    }
  }

  if (["Haval", "JAC", "GAC"].includes(make)) {
    // HAVAL & JAC & GAC - all price ranges
    // Option 1: With exemption - 2.25%
    offers.push(
      createMadaOffer(
        0.0225,
        "",
        "500 جنيه عن الحادث",
        "haval-jac-gac-exemption",
        carInfo,
        [
          "اعفاء شرط الإصلاح في التوكيل اول 3 سنوات متضمنه سنة الموديل",
          "يتحمل المؤمن له مبلغ 500 جنيه عن الحادث",
        ]
      )
    );

    // Option 2: With repair requirement - 2.00%
    offers.push(
      createMadaOffer(
        0.02,
        "",
        "500 جنيه عن الحادث",
        "haval-jac-gac-repair",
        carInfo,
        [
          "تطبيق تحمل 10% شرط الإصلاح في التوكيل",
          "يتحمل المؤمن له مبلغ 500 جنيه عن الحادث",
        ]
      )
    );
  }

  if (make === "BYD") {
    // BYD - all price ranges: 2.50%
    offers.push(
      createMadaOffer(
        0.025,
        "",
        "500 جنيه عن الحادث",
        "byd-gasoline",
        carInfo,
        [
          "اعفاء المؤمن له شرط الإصلاح في التوكيل سنة اولى متضمنه سنة الموديل وللسيارات الزيرو",
          "يتحمل المؤمن له مبلغ 500 جنيه عن الحادث",
        ]
      )
    );
  }

  return offers;
}

function calculateMadaRegularBrands(carInfo: CarInfo): InsuranceOffer[] {
  const { market_price } = carInfo;
  const offers: InsuranceOffer[] = [];

  // Under 500,000 EGP to 501,000 EGP - Rate: 2.50%
  if (market_price < 500000 || market_price <= 501000) {
    offers.push(
      createMadaOffer(
        0.025,
        "",
        "300 جنيه عن الحادث",
        "regular-under-501k",
        carInfo,
        [
          "اعفاء شرط الإصلاح في التوكيل اول 3 سنوات متضمنه سنة",
          "يتحمل المؤمن له مبلغ 300 جنيه عن الحادث",
        ]
      )
    );
  }

  // 501,000 EGP : 1000,000 EGP - Rate: 2.00%
  if (market_price >= 501000 && market_price <= 1000000) {
    offers.push(
      createMadaOffer(
        0.02,
        "",
        "300 جنيه عن الحادث",
        "regular-501k-1m-exemption",
        carInfo,
        [
          "اعفاء شرط الإصلاح في التوكيل اول 3 سنوات متضمنه سنة",
          "يتحمل المؤمن له مبلغ 300 جنيه عن الحادث",
        ]
      )
    );
  }

  // 501,000 EGP : 1000,000 EGP - Rate: 1.80%
  if (market_price >= 501000 && market_price <= 1000000) {
    offers.push(
      createMadaOffer(
        0.018,
        "",
        "300 جنيه عن الحادث",
        "regular-501k-1m-repair",
        carInfo,
        [
          "تطبيق تحمل 10% شرط الإصلاح في التوكيل",
          "يتحمل المؤمن له مبلغ 300 جنيه عن الحادث",
        ]
      )
    );
  }

  // Over 1,000,000 EGP - Rate: 1.80%
  if (market_price > 1000000) {
    offers.push(
      createMadaOffer(
        0.018,
        "",
        "300 جنيه عن الحادث",
        "regular-over-1m-exemption",
        carInfo,
        [
          "اعفاء شرط الإصلاح في التوكيل اول 5 سنوات متضمنه سنة الموديل",
          "يتحمل المؤمن له مبلغ 300 جنيه عن الحادث",
        ]
      )
    );
  }

  // Over 1,000,000 EGP - Rate: 1.60%
  if (market_price > 1000000) {
    offers.push(
      createMadaOffer(
        0.016,
        "",
        "4 في الألف من مبلغ التأمين عن الحادث",
        "regular-over-1m-repair",
        carInfo,
        [
          "تطبيق تحمل 10% شرط الإصلاح في التوكيل",
          "يتحمل المؤمن له 4 في الألف من مبلغ التأمين عن الحادث",
        ]
      )
    );
  }

  // Over 1,000,000 EGP - Rate: 1.40%
  if (market_price > 1000000) {
    offers.push(
      createMadaOffer(
        0.014,
        "",
        "4 في الألف من مبلغ التأمين + 10% من المطالبة",
        "regular-over-1m-premium",
        carInfo,
        [
          "تطبيق تحمل 10% شرط الإصلاح في التوكيل",
          "يتحمل المؤمن له 4 في الألف من مبلغ التأمين عن الحادث",
          "يتحمل المؤمن له 10% من المطالبة",
        ]
      )
    );
  }

  return offers;
}

function calculateWethaqOffers(
  carInfo: CarInfo,
  carAge: number
): InsuranceOffer[] {
  const { make, market_price, fuel_type } = carInfo;
  const offers: InsuranceOffer[] = [];

  if (fuel_type === "electric") {
    return calculateWethaqElectric(carInfo);
  }

  // Adjust car age calculation (add 1 year)
  const adjustedCarAge = carAge + 1;

  // Cars 0-5 years old
  if (adjustedCarAge <= 5) {
    return calculateWethaqNewCars(carInfo);
  }
  // Cars 6-7 years
  else if (adjustedCarAge >= 6 && adjustedCarAge <= 7) {
    return calculateWethaq6to7Years(carInfo);
  }
  // Cars 8-10 years
  else if (adjustedCarAge >= 8 && adjustedCarAge <= 10) {
    return calculateWethaq8to10Years(carInfo);
  }

  // Cars older than 10 years - no offers
  return [];
}

function calculateWethaqNewCars(carInfo: CarInfo): InsuranceOffer[] {
  const { make, market_price } = carInfo;
  const offers: InsuranceOffer[] = [];

  // Special handling for JAC & GAC
  if (["JAC", "GAC"].includes(make)) {
    // Option 1: 2.50% with exemption
    offers.push(
      createWethaqOffer(
        0.025,
        "",
        "200 جنيه عن الحادث",
        "jac-gac-exemption",
        carInfo,
        [
          "اعفاء شرط الإصلاح في التوكيل اول 5 سنوات متضمنه سنة الموديل",
          "محضر الشرطه من اول 100 الف للسيارات اقل من مليون",
          "اكثر من مليون يعفى من محضر الشرطه الا في حاله السرقه والمسؤليه المدنيه والهلاك الكلى",
          "مسؤليه مدنيه 100الف + حوادث شخصيه 100الف لـ4افراد + خدمه الطريق",
          "يتحمل المؤمن له مبلغ 200 جنيه عن الحادث",
        ]
      )
    );

    // Option 2: 2.25% with repair requirement
    offers.push(
      createWethaqOffer(
        0.0225,
        "",
        "200 جنيه عن الحادث",
        "jac-gac-repair",
        carInfo,
        [
          "تطبيق تحمل 10% شرط الإصلاح في التوكيل",
          "محضر الشرطه من اول 100 الف للسيارات اقل من مليون",
          "اكثر من مليون يعفى من محضر الشرطه الا في حاله السرقه والمسؤليه المدنيه والهلاك الكلى",
          "مسؤليه مدنيه 100الف + حوادث شخصيه 100الف لـ4افراد + خدمه الطريق",
          "يتحمل المؤمن له مبلغ 200 جنيه عن الحادث",
        ]
      )
    );

    return offers;
  }

  // Special handling for Jetour - minimum 801,000 EGP
  if (make === "Jetour") {
    if (market_price >= 801000) {
      offers.push(
        createWethaqOffer(
          0.02,
          "",
          "200 جنيه عن الحادث",
          "jetour-801k-over",
          carInfo,
          [
            "اعفاء شرط الإصلاح في التوكيل اول 5 سنوات متضمنه سنة الموديل",
            "محضر الشرطه من اول 100 الف للسيارات اقل من مليون",
            "اكثر من مليون يعفى من محضر الشرطه الا في حاله السرقه والمسؤليه المدنيه والهلاك الكلى",
            "الاكثر من 400 الف تشمل:مسؤليه مدنيه 100الف+حوادث شخصيه 100الف لـ4افراد + خدمه الطريق",
            "يتحمل المؤمن له مبلغ 200 جنيه عن الحادث",
          ]
        )
      );
    }
    return offers;
  }

  // Regular brands - price-based rates
  const baseConditions = [
    "بدون شرط التوكيل للسيارات الاقل من خمس سنوات من سنه الموديل",
    "محضر الشرطه من اول 100 الف للسيارات اقل من مليون",
    "اكثر من مليون يعفى من محضر الشرطه الا في حاله السرقه والمسؤليه المدنيه والهلاك الكلى",
    "الاكثر من 400 الف تشمل: مسؤليه مدنيه 100الف + حوادث شخصيه 100الف لـ4 افراد + خدمه الطريق",
    "يتحمل المؤمن له مبلغ 200 جنيه عن الحادث",
  ];

  // 101,000 EGP : 300,000 EGP - Rate: 2.35%
  if (market_price >= 101000 && market_price <= 300000) {
    offers.push(
      createWethaqOffer(
        0.0235,
        "",
        "200 جنيه عن الحادث",
        "regular-101k-300k",
        carInfo,
        baseConditions
      )
    );
  }

  // 301,000 EGP : 500,000 EGP - Rate: 2.20%
  if (market_price >= 301000 && market_price <= 500000) {
    offers.push(
      createWethaqOffer(
        0.022,
        "",
        "200 جنيه عن الحادث",
        "regular-301k-500k",
        carInfo,
        baseConditions
      )
    );
  }

  // 501,000 EGP : 1,000,000 EGP - Rate: 2.00%
  if (market_price >= 501000 && market_price <= 1000000) {
    offers.push(
      createWethaqOffer(
        0.02,
        "",
        "200 جنيه عن الحادث",
        "regular-501k-1m",
        carInfo,
        baseConditions
      )
    );
  }

  // 1,001,000 EGP : 6,000,000 EGP - Rate: 1.80%
  if (market_price >= 1001000 && market_price <= 6000000) {
    offers.push(
      createWethaqOffer(
        0.018,
        "",
        "200 جنيه عن الحادث",
        "regular-1001k-6m",
        carInfo,
        baseConditions
      )
    );
  }

  // Over 6,000,000 EGP - Rate: 1.60%
  if (market_price > 6000000) {
    offers.push(
      createWethaqOffer(
        0.016,
        "",
        "200 جنيه عن الحادث",
        "regular-over-6m",
        carInfo,
        baseConditions
      )
    );
  }

  return offers;
}

function calculateWethaq6to7Years(carInfo: CarInfo): InsuranceOffer[] {
  const { market_price } = carInfo;
  const offers: InsuranceOffer[] = [];
  const baseConditions = ["تطبيق تحمل 25% شرط الإصلاح في التوكيل"];

  // 101,000 EGP : 300,000 EGP - Rate: 2.58%
  if (market_price >= 101000 && market_price <= 300000) {
    offers.push(
      createWethaqOffer(
        0.0258,
        "",
        "تحمل 25% شرط التوكيل",
        "6to7-101k-300k",
        carInfo,
        baseConditions
      )
    );
  }

  // 301,000 EGP : 500,000 EGP - Rate: 2.42%
  if (market_price >= 301000 && market_price <= 500000) {
    offers.push(
      createWethaqOffer(
        0.0242,
        "",
        "تحمل 25% شرط التوكيل",
        "6to7-301k-500k",
        carInfo,
        baseConditions
      )
    );
  }

  // 501,000 EGP : 1,000,000 EGP - Rate: 2.20%
  if (market_price >= 501000 && market_price < 1000000) {
    offers.push(
      createWethaqOffer(
        0.022,
        "",
        "تحمل 25% شرط التوكيل",
        "6to7-501k-1m",
        carInfo,
        baseConditions
      )
    );
  }

  // 1,001,000 EGP : 6,000,000 EGP - Rate: 1.98%
  if (market_price >= 1000000 && market_price <= 6000000) {
    offers.push(
      createWethaqOffer(
        0.0198,
        "",
        "تحمل 25% شرط التوكيل",
        "6to7-1001k-6m",
        carInfo,
        baseConditions
      )
    );
  }

  // Over 6,000,000 EGP - Rate: 1.76%
  if (market_price > 6000000) {
    offers.push(
      createWethaqOffer(
        0.0176,
        "",
        "تحمل 25% شرط التوكيل",
        "6to7-over-6m",
        carInfo,
        baseConditions
      )
    );
  }

  return offers;
}

function calculateWethaq8to10Years(carInfo: CarInfo): InsuranceOffer[] {
  const { market_price } = carInfo;
  const offers: InsuranceOffer[] = [];
  const baseConditions = ["تطبيق تحمل 25% شرط الإصلاح في التوكيل"];

  // 101,000 EGP : 300,000 EGP - Rate: 2.82%
  if (market_price >= 101000 && market_price <= 300000) {
    offers.push(
      createWethaqOffer(
        0.0282,
        "",
        "تحمل 25% شرط التوكيل",
        "8to10-101k-300k",
        carInfo,
        baseConditions
      )
    );
  }

  // 301,000 EGP : 500,000 EGP - Rate: 2.64%
  if (market_price >= 301000 && market_price <= 500000) {
    offers.push(
      createWethaqOffer(
        0.0264,
        "",
        "تحمل 25% شرط التوكيل",
        "8to10-301k-500k",
        carInfo,
        baseConditions
      )
    );
  }

  // 501,000 EGP : 1,000,000 EGP - Rate: 2.40%
  if (market_price >= 501000 && market_price < 1000000) {
    offers.push(
      createWethaqOffer(
        0.024,
        "",
        "تحمل 25% شرط التوكيل",
        "8to10-501k-1m",
        carInfo,
        baseConditions
      )
    );
  }

  // 1,000,000 EGP : 6,000,000 EGP - Rate: 2.16%
  if (market_price >= 1000000 && market_price <= 6000000) {
    offers.push(
      createWethaqOffer(
        0.0216,
        "",
        "تحمل 25% شرط التوكيل",
        "8to10-1001k-6m",
        carInfo,
        baseConditions
      )
    );
  }

  // Over 6,000,000 EGP - Rate: 1.92%
  if (market_price > 6000000) {
    offers.push(
      createWethaqOffer(
        0.0192,
        "",
        "تحمل 25% شرط التوكيل",
        "8to10-over-6m",
        carInfo,
        baseConditions
      )
    );
  }

  return offers;
}

function calculateWethaqElectric(carInfo: CarInfo): InsuranceOffer[] {
  const { make, has_official_dealership } = carInfo;

  // Use user input first, then fallback to brand list
  const hasOfficialDealer =
    has_official_dealership !== undefined
      ? has_official_dealership
      : ELECTRIC_BRANDS_WITH_DEALERSHIP.includes(make.toUpperCase());

  const electricConditions = [
    "اعفاء شرط الإصلاح في التوكيل",
    "تحمل 25% بطاريه",
    "تحمل 10% لكل المطالبه",
    "بدون تحمل اجبارى",
  ];

  if (hasOfficialDealer) {
    return [
      createWethaqOffer(
        0.018,
        "(وكالة رسمية)",
        "تحمل 25% بطاريه + 10% هلاك كلى",
        "electric-official",
        carInfo,
        electricConditions
      ),
    ];
  } else {
    return [
      createWethaqOffer(
        0.02,
        "(بدون وكالة)",
        "تحمل 25% بطاريه + 10% هلاك كلى",
        "electric-no-official",
        carInfo,
        electricConditions
      ),
    ];
  }
}

function calculateGIGOffers(carInfo: CarInfo): InsuranceOffer[] {
  const { make, market_price, fuel_type, year } = carInfo;
  const offers: InsuranceOffer[] = [];
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - year;

  // GIG only covers gasoline cars
  if (fuel_type === "electric") {
    return [];
  }

  // Private Policy conditions
  const privateConditions = [
    "محضر شرطه : للحوادث أكبر من 10% من مبلغ التامين",
    "تغطيه الحوادث الشخصيه 10 الاف للسائق",
    "تطبيق تحمل 10% شرط الإصلاح في التوكيل",
    "تغطيه المسؤليه المدنيه بقيمه 50 الف",
    "تحمل 25% فى حاله لم يتعدى سن الرشد",
    "خدمه ونش",
  ];

  // Private Policy rates
  // 101,000 EGP : 300,000 EGP - Rate: 3.00%
  if (market_price >= 101000 && market_price <= 300000) {
    offers.push(
      createGIGOffer(
        0.03,
        "خاصة",
        "تحمل 25% فى حاله لم يتعدى سن الرشد",
        false,
        "private-101k-300k",
        carInfo,
        privateConditions
      )
    );
  }

  // 301,000 EGP : 500,000 EGP - Rate: 2.35%
  if (market_price >= 301000 && market_price < 500000) {
    offers.push(
      createGIGOffer(
        0.0235,
        "خاصة",
        "تحمل 25% فى حاله لم يتعدى سن الرشد",
        false,
        "private-301k-500k",
        carInfo,
        privateConditions
      )
    );
  }

  // 501,000 EGP : 5,000,000 EGP - Rate: 1.80%
  if (market_price >= 500000 && market_price <= 5000000) {
    offers.push(
      createGIGOffer(
        0.018,
        "خاصة",
        "تحمل 25% فى حاله لم يتعدى سن الرشد",
        false,
        "private-501k-5m",
        carInfo,
        privateConditions
      )
    );
  }

  // 5,000,000 EGP - Over 5,000,000 EGP - Rate: 1.60%
  if (market_price >= 5000000) {
    offers.push(
      createGIGOffer(
        0.016,
        "خاصة",
        "تحمل 25% فى حاله لم يتعدى سن الرشد",
        false,
        "private-over-5m",
        carInfo,
        privateConditions
      )
    );
  }

  // Gold Policy (only for cars >= 501,000 and car age 0-5 years)
  if (market_price >= 501000 && carAge <= 5) {
    const goldConditions = [
      "محضر شرطه : للحوادث أكبر من 10% من مبلغ التامين",
      "تغطيه الحوادث الشخصيه 75 الف للفرد لعدد 4 افراد متضمنه السائق",
      "بدون شرط التوكيل",
      "خدمه ونش",
      "استبدال مفتاح",
      "5% الحد الاقصى لتعويض البانوراما",
      "10% الزجاج الامامى",
      "5% الخلفى",
      "5% الكاسيت",
      "المسؤليه المدنيه : 150.000 جـم",
      "تحمل 25% فى حاله لم يتعدى سن الرشد",
    ];

    const isSpecialBrand = ["Opel", "Chevrolet", "MG"].includes(make);

    // 501,000 EGP : 5,000,000 EGP
    if (market_price >= 501000 && market_price <= 5000000) {
      const rate = isSpecialBrand ? 0.0225 : 0.024;
      const rateLabel = isSpecialBrand ? "2.25%" : "2.40%";
      offers.push(
        createGIGOffer(
          rate,
          `جولد`,
          "تحمل 25% فى حاله لم يتعدى سن الرشد",
          true,
          isSpecialBrand
            ? "gold-special-brands-501k-5m"
            : "gold-regular-501k-5m",
          carInfo,
          goldConditions
        )
      );
    }

    // Over 5,000,000 EGP - Rate: 2.00%
    if (market_price > 5000000) {
      offers.push(
        createGIGOffer(
          0.02,
          "جولد",
          "تحمل 25% فى حاله لم يتعدى سن الرشد",
          true,
          "gold-over-5m",
          carInfo,
          goldConditions
        )
      );
    }
  }

  return offers;
}

function createMadaOffer(
  premiumRate: number,
  policyType: string,
  deductible: string,
  optionId: string,
  carInfo: CarInfo,
  specificConditions: string[]
): InsuranceOffer {
  const annualPremium = carInfo.market_price * premiumRate;

  const generalConditions = [
    "تغطيه المساعدة على الطريق الى 100 كم",
    "اعفاء المؤمن له من تقديم محضر شرطة فيما عدا الحالات التالية (الهلاك الكلي - السرقة - الحريق - المسئولية المدنية)",
    "تغطيه المسؤولية المدنية 100 ألف جنيه",
  ];

  return {
    company: "Mada Insurance",
    policyType,
    premiumRate,
    annualPremium,
    features: {
      en: [],
      ar: [],
    },
    conditions: {
      en: [...specificConditions, ...generalConditions],
      ar: [...specificConditions, ...generalConditions],
    },
    logo: "/mada-logo.svg",
    companyColor: "#1e40af",
    deductible,
    optionId,
  };
}

function createWethaqOffer(
  premiumRate: number,
  policyType: string,
  deductible: string,
  optionId: string,
  carInfo: CarInfo,
  conditions: string[]
): InsuranceOffer {
  const annualPremium = carInfo.market_price * premiumRate;

  return {
    company: "Wethaq Insurance",
    policyType,
    premiumRate,
    annualPremium,
    features: {
      en: [],
      ar: [],
    },
    conditions: {
      en: conditions,
      ar: conditions,
    },
    logo: "/wethaq-logo.svg",
    companyColor: "#059669",
    deductible,
    optionId,
  };
}

function createGIGOffer(
  premiumRate: number,
  policyType: string,
  deductible: string,
  isGold: boolean,
  optionId: string,
  carInfo: CarInfo,
  conditions: string[]
): InsuranceOffer {
  const annualPremium = carInfo.market_price * premiumRate;

  return {
    company: "GIG Insurance",
    policyType,
    premiumRate,
    annualPremium,
    planType: isGold ? "Gold" : "Private",
    features: {
      en: [],
      ar: [],
    },
    conditions: {
      en: conditions,
      ar: conditions,
    },
    logo: "/gig-logo.svg",
    companyColor: "#dc2626",
    deductible,
    optionId,
  };
}
