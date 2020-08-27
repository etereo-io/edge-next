import { FieldOptionType, FieldType } from './fields'

import { ContentTypeDefinition } from './contentTypeDefinition'
import { GroupTypeDefinition } from './groupTypeDefinition'
import { PermissionsType } from './permissions'
import { UserType } from './entities/user'
import { InteractionTypeDefinition } from '@lib/types/interactionTypeDefinition'

export declare type ThemeType = {
  label: string;
  value: string;
  mainColor: string;
  borderColor: string;
}

export declare type ConfigType = {
  title: string;
  description: string;
  slogan?: string;
  url: string;
  api: {
    bodyParser: {
      sizeLimit: string;
    }
  };
  logger: {
    level: string;
  }
  storage: {
    type: string;
  };
  database: {
    type: string;
  };
  emails: {
    from: string;
    contact: string;
  };
  theme: {
    default: string;
    themes: ThemeType[];
  },
  activity: {
    enabled: boolean;
    permissions: PermissionsType[];
    initialActivity: any[]; // TODO: Add type
  },
  like: {
    enabled: boolean;
  },
  follow: {
    enabled: boolean;
  },
  user: {
    roles: FieldOptionType[];
    newUserRoles: string[];
    emailVerification: boolean;
    providers: object;
    profile: {
      fields: FieldType[];
    };
    permissions: PermissionsType[];
    initialUsers: UserType[];
    entityInteractions: InteractionTypeDefinition[];
  },

  content: {
    types: ContentTypeDefinition[];
    initialContent: any[]; // TODO: Add type
  },

  groups: {
    types: GroupTypeDefinition[];
  }
  permissions: object;
  superSearch: {
    enabled: boolean
    permissions: string[];
    entities: Array<{name: string; fields: string[]; permissions: string[], type: string, fieldsForShow: string[]}>
  }
}