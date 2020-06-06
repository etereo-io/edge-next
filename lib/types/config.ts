import { ContentType } from './contentType'
import { FieldType } from './fields'
import { PermissionsType } from './permissions'
import { UserType } from './user'

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
  roles: object,
  activity: {
    enabled: boolean;
    permissions: PermissionsType[];
    initialActivity: any[]; // TODO: Add type
  },
  user: {
    roles: string[];
    emailVerification: boolean;
    providers: object;
    profile: {
      fields: FieldType[];
    };
    permissions: PermissionsType[];
    initialUsers: UserType[];
  },

  content: {
    types: ContentType[];
    initialContent: any[]; // TODO: Add type
  },

  groups: {
    types: ContentType[];
  }
  permissions: object;
}