# SkillsHub CLI (skm)

The official command-line interface for SkillsHub, a platform for managing and sharing AI agent skills.

## Installation

```bash
npm install -g @skillshub/cli
```

Or use without installing:

```bash
npx @skillshub/cli [command]
```

## Commands

### init
Initialize a new skill project:
```bash
skm init --name my-skill --description "A new AI skill"
```

### login
Login to SkillsHub platform:
```bash
skm login --token YOUR_TOKEN
```

### config
Manage CLI configuration:
```bash
# List all configurations
skm config --list

# Get specific configuration
skm config --get apiUrl

# Set configuration
skm config --set apiUrl=https://api.skillshub.example.com
```

### get
Download a skill from SkillsHub:
```bash
skm get skill-name --output ./my-skills
```

### push
Upload/push a skill to SkillsHub:
```bash
skm push --public
```

### list
List skills from SkillsHub:
```bash
skm list --category ai --limit 10
```

## Configuration

The CLI stores configuration in a local config file. You can manage it using the `config` command.

### Default Configuration Values
- `apiUrl`: The SkillsHub API endpoint
- `token`: Authentication token
- `defaultTemplate`: Template for new projects
- `autoSync`: Whether to sync automatically

## Usage Examples

### Creating a new skill
```bash
# Initialize a new skill project
skm init --name my-translator --template basic

# Navigate to the project directory
cd my-translator

# Edit your skill configuration
# Then push to SkillsHub
skm push --public
```

### Using an existing skill
```bash
# Search for skills
skm list --search translator --category ai

# Download a skill
skm get gpt-translator
```

## Development

To run the CLI locally during development:

```bash
cd skm-cli
npm install
node src/index.js [command]
```

## Contributing

See our contributing guide for more information on how to contribute to the SkillsHub CLI.

## License

MIT