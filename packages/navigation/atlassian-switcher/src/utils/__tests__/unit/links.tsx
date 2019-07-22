import {
  getFixedProductLinks,
  getProductLink,
  getLicensedProductLinks,
  PRODUCT_DATA_MAP,
  getProductIsActive,
  getAdministrationLinks,
  getSuggestedProductLink,
} from '../../links';
import {
  ProductLicenseInformation,
  LicenseInformationResponse,
  ProductKey,
} from '../../../types';

import { resolveRecommendations } from '../../../providers/recommendations';

const HOSTNAME = 'my-hostname.com';
const ACTIVE_PRODUCT_STATE = {
  state: 'ACTIVE',
};
const generateLicenseInformation = (activeProducts: string[]) => {
  const products = activeProducts.reduce(
    (ans: { [productKey: string]: any }, next: string) => {
      ans[next] = ACTIVE_PRODUCT_STATE;
      return ans;
    },
    {} as ProductLicenseInformation,
  );
  return {
    hostname: HOSTNAME,
    products,
  };
};

const generateOpsgenieLicenseInformation = (
  applicationUrl?: string,
): LicenseInformationResponse => ({
  hostname: HOSTNAME,
  products: {
    [ProductKey.OPSGENIE]: {
      ...ACTIVE_PRODUCT_STATE,
      applicationUrl,
    },
  },
});

describe('utils/links', () => {
  it('Fixed product list should have People', () => {
    const expectedProducts = ['people'];
    const fixedLinks = getFixedProductLinks();
    expect(fixedLinks.map(({ key }) => key)).toMatchObject(expectedProducts);
  });

  it('getProductLink should create a correct link config', () => {
    const productLink = getProductLink(
      ProductKey.CONFLUENCE,
      generateLicenseInformation([ProductKey.CONFLUENCE]).products[
        ProductKey.CONFLUENCE
      ],
    );
    const expectedLink = {
      key: 'confluence.ondemand',
      ...PRODUCT_DATA_MAP[ProductKey.CONFLUENCE],
    };
    expect(productLink).toMatchObject(expectedLink);
  });

  it('getProductLink should return correct Opsgenie application link', () => {
    const productLink = getProductLink(
      ProductKey.OPSGENIE,
      generateOpsgenieLicenseInformation('https://test.app.opsgeni.us')
        .products[ProductKey.OPSGENIE],
    );

    const expectedLink = {
      ...PRODUCT_DATA_MAP[ProductKey.OPSGENIE],
      key: 'opsgenie',
      href: 'https://test.app.opsgeni.us',
    };

    expect(productLink).toMatchObject(expectedLink);
  });

  it('getProductLink should return default Opsgenie link when missing in license information', () => {
    const productLink = getProductLink(
      ProductKey.OPSGENIE,
      generateOpsgenieLicenseInformation(undefined).products[
        ProductKey.OPSGENIE
      ],
    );

    const expectedLink = {
      ...PRODUCT_DATA_MAP[ProductKey.OPSGENIE],
      key: 'opsgenie',
    };

    expect(productLink).toMatchObject(expectedLink);
  });

  describe('getProductIsActive', () => {
    const productKey = 'some.awesome.new.atlassian.product';
    const licenseInformation = generateLicenseInformation([productKey]);
    it('should return true if a product is active', () => {
      const result = getProductIsActive(licenseInformation, productKey);
      expect(result).toBe(true);
    });
    it('should return false if a product is not active', () => {
      const productKey = 'some.eol.product';
      const result = getProductIsActive(licenseInformation, productKey);
      expect(result).toBe(false);
    });
  });

  describe('getLicensedProductLinks', () => {
    it('should only add active products', () => {
      const licenseInformation = generateLicenseInformation([
        'confluence.ondemand',
      ]);
      const result = getLicensedProductLinks(licenseInformation);
      expect(result.map(({ key }) => key)).toMatchObject([
        'confluence.ondemand',
      ]);
    });
    it('should return exactly what license information returns', () => {
      const licenseInformation = generateLicenseInformation([
        'jira-software.ondemand',
        'jira-servicedesk.ondemand',
        'jira-incident-manager.ondemand',
        'jira-core.ondemand',
      ]);
      const result = getLicensedProductLinks(licenseInformation);
      expect(result.map(({ key }) => key)).toMatchObject([
        'jira-software.ondemand',
        'jira-servicedesk.ondemand',
        'jira-incident-manager.ondemand',
        'jira-core.ondemand',
      ]);
    });

    it('should return opsgenie link', () => {
      const opsgenieLicenseInformation = generateOpsgenieLicenseInformation(
        'https://test.app.opsgeni.us',
      );

      const result = getLicensedProductLinks(opsgenieLicenseInformation);

      expect(result.map(({ key, href }) => ({ key, href }))).toMatchObject([
        {
          key: 'opsgenie',
          href: 'https://test.app.opsgeni.us',
        },
      ]);
    });
  });

  describe('getAdministrationLinks', () => {
    it('should assemble admin links for site admins', () => {
      const isAdmin = true;
      const result = getAdministrationLinks(isAdmin);
      const expectedResult = [`/admin/billing/addapplication`, `/admin`];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
    it('should assemble admin links for site trusted users', () => {
      const isAdmin = false;
      const result = getAdministrationLinks(isAdmin);
      const expectedResult = [
        `/trusted-admin/billing/addapplication`,
        `/trusted-admin`,
      ];
      expect(result.map(({ href }) => href)).toMatchObject(expectedResult);
    });
  });

  describe('getXSellLink', () => {
    const suggestedProducts = resolveRecommendations();
    it('should offer both JSW and Confluence if no products are active', () => {
      const licenseInformation = generateLicenseInformation([]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.CONFLUENCE);
    });
    it('should offer both JSW and JSD if Confluence is active', () => {
      const licenseInformation = generateLicenseInformation([
        ProductKey.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer both Confluence and JSD if Jira is active', () => {
      const licenseInformation = generateLicenseInformation([
        ProductKey.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
      expect(result[1]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer Jira Service Desk if Confluence and JSW are active', () => {
      const licenseInformation = generateLicenseInformation([
        ProductKey.JIRA_SOFTWARE,
        ProductKey.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SERVICE_DESK);
    });
    it('should offer Confluence if JSW and JSD are active', () => {
      const licenseInformation = generateLicenseInformation([
        ProductKey.JIRA_SOFTWARE,
        ProductKey.JIRA_SERVICE_DESK,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result.length).toEqual(1);
      expect(result[0]).toHaveProperty('key', ProductKey.CONFLUENCE);
    });
    it('should return Jira if Confluence and JSD are active', () => {
      const licenseInformation = generateLicenseInformation([
        ProductKey.JIRA_SERVICE_DESK,
        ProductKey.CONFLUENCE,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result[0]).toHaveProperty('key', ProductKey.JIRA_SOFTWARE);
    });
    it('should return any empty array if Confluence, JSD and JSW are active', () => {
      const licenseInformation = generateLicenseInformation([
        ProductKey.JIRA_SERVICE_DESK,
        ProductKey.CONFLUENCE,
        ProductKey.JIRA_SOFTWARE,
      ]);
      const result = getSuggestedProductLink(
        licenseInformation,
        suggestedProducts,
      );
      expect(result).toHaveLength(0);
    });
  });
});
