// @ts-ignore
import { prefixPluginTranslations } from "@strapi/helper-plugin";
import { StrapiAdminInstance } from "strapi-typed";
import * as pluginPkg from "../../package.json";
import { pluginId } from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";
import pluginPermissions from "./permissions";
import reducers from "./reducers";
import { ToBeFixed } from "../../types";
import { registerCustomFields } from "./custom-fields";

const { name, displayName } = pluginPkg.strapi;

export default {
  register(app: StrapiAdminInstance) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      badgeContent: 1,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: displayName,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ './pages/App'
        );

        return component;
      },
      permissions: pluginPermissions.access,
    });

    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.section`,
          defaultMessage: `${displayName} plugin`,
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.section.item`,
            defaultMessage: "Configuration",
          },
          id: "comments",
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "documentation-settings" */ "./pages/Settings"
            );

            return component;
          },
          permissions: pluginPermissions.settings,
        },
      ]
    );

    app.addReducers(reducers);
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });

    registerCustomFields(app);
  },

  // bootstrap(app: ToBeFixed) {
  //   // app.injectContentManagerComponent('editView', 'informations', {
  //   //     name: 'comments-link',
  //   //     Component: () => 'TODO: Comments count',
  //   // });
  // },

  async registerTrads({ locales }: ToBeFixed) {
    const importedTrads = await Promise.all(
      locales.map((locale: ToBeFixed) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
