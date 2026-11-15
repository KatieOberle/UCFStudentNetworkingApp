import 'package:flutter/material.dart';

class Community {
  final String id;
  final String name;

  const Community({required this.id, required this.name});
}

class ThreadDraft {
  final String title;
  final String body;
  final String? communityId;

  const ThreadDraft({
    required this.title,
    required this.body,
    this.communityId,
  });
}

class CreateThreadPage extends StatefulWidget {
  final VoidCallback? onBackClick;
  final List<Community> communities;
  final Future<void> Function(ThreadDraft thread)? onCreateThread;

  const CreateThreadPage({
    super.key,
    this.onBackClick,
    this.communities = const [],
    this.onCreateThread,
  });

  @override
  State<CreateThreadPage> createState() => _CreateThreadPageState();
}

class _CreateThreadPageState extends State<CreateThreadPage> {
  final _titleController = TextEditingController();
  final _bodyController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _communityId = '';
  String _error = '';
  bool _submitting = false;

  void _goBack() {
    if (widget.onBackClick != null) {
      widget.onBackClick!();
    } else {
      Navigator.of(context).maybePop();
    }
  }

  Future<void> _handleSubmit() async {
    setState(() => _error = '');
    if (!_formKey.currentState!.validate()) return;

    if (widget.onCreateThread == null) {
      setState(() => _error = 'Thread publishing is not connected to the server yet.');
      return;
    }

    setState(() => _submitting = true);
    try {
      await widget.onCreateThread!(ThreadDraft(
        title: _titleController.text.trim(),
        body: _bodyController.text.trim(),
        communityId: _communityId.isEmpty ? null : _communityId,
      ));
      if (!mounted) return;
      _goBack();
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to publish your thread. Please try again.');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _bodyController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        actions: [
          TextButton(
            onPressed: _goBack,
            child: const Text('Back to Discussions'),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1200),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Create a Thread', style: Theme.of(context).textTheme.headlineMedium),
                  const SizedBox(height: 12),
                  const Text('Start a discussion, share an opportunity, or ask a question to your UCF network.'),
                  const SizedBox(height: 32),
                  TextFormField(
                    controller: _titleController,
                    maxLength: 150,
                    decoration: const InputDecoration(
                      labelText: 'Thread Title',
                      hintText: 'What would you like to discuss?',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Please enter a title.'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _bodyController,
                    minLines: 7,
                    maxLines: 10,
                    decoration: const InputDecoration(
                      labelText: 'Description',
                      hintText: 'Write your discussion here...',
                      border: OutlineInputBorder(),
                      alignLabelWithHint: true,
                    ),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Please enter a description.'
                        : null,
                  ),
                  const SizedBox(height: 20),
                  DropdownButtonFormField<String>(
                    value: _communityId,
                    decoration: const InputDecoration(
                      labelText: 'Community (Optional)',
                      border: OutlineInputBorder(),
                    ),
                    items: [
                      const DropdownMenuItem(value: '', child: Text('General discussion')),
                      ...widget.communities.map(
                        (community) => DropdownMenuItem(
                          value: community.id,
                          child: Text(community.name),
                        ),
                      ),
                    ],
                    onChanged: _submitting ? null : (value) {
                      setState(() => _communityId = value ?? '');
                    },
                  ),
                  if (_error.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(_error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  ],
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    alignment: WrapAlignment.end,
                    children: [
                      OutlinedButton(
                        onPressed: _submitting ? null : _goBack,
                        child: const Text('Cancel'),
                      ),
                      FilledButton(
                        onPressed: _submitting ? null : _handleSubmit,
                        child: Text(_submitting ? 'Publishing...' : 'Create Thread'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
